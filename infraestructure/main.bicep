param environment string
param location string = resourceGroup().location
param swaLocation string = 'westeurope'

@allowed([ 'Free', 'Standard' ])
param sku string = 'Standard'

param keyVaultSku object = {
    name: 'standard'
    family: 'A'
}

@allowed([
    'Standard_LRS'
    'Standard_GRS'
    'Standard_RAGRS'
])
param storageAccountType string = 'Standard_LRS'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
    name: 's118-${environment}-itf-acs-portal-identity'
    location: location
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
    name: 's118-${environment}-itf-acs-kv'
    location: location
    properties: {
        enableRbacAuthorization: false
        tenantId: tenant().tenantId
        sku: keyVaultSku
        accessPolicies: [
            {
                objectId: managedIdentity.properties.principalId
                tenantId: tenant().tenantId
                permissions: {
                    secrets: [
                        'all'
                    ]
                }
            }
        ]
    }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
    name: 's118${environment}itfacsportalsa'
    location: location
    sku: {
        name: storageAccountType
    }
    kind: 'Storage'
}

resource hostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
    name: 's118-${environment}-itf-acs-portal-fa'
    location: location
    sku: {
        name: 'Y1'
        tier: 'Dynamic'
    }
    properties: {}
}

resource functionApp 'Microsoft.Web/sites@2021-03-01' = {
    name: 's118-${environment}-itf-acs-portal-fa'
    location: location
    kind: 'functionapp'
    identity: {
        type: 'UserAssigned'
        userAssignedIdentities: {
            '${managedIdentity.id}': {}
        }
    }
    properties: {
        serverFarmId: hostingPlan.id
        siteConfig: {
            ftpsState: 'FtpsOnly'
            minTlsVersion: '1.2'
            appSettings: [
                {
                    name: 'AzureWebJobsStorage'
                    value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
                }
                {
                    name: 'FUNCTIONS_WORKER_RUNTIME'
                    value: 'dotnet-isolated'
                }
            ]
        }
        httpsOnly: true
    }
}

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
    name: 's118-${environment}-itf-acs-portal-swa'
    location: swaLocation
    tags: null
    properties: {}
    identity: {
        type: 'UserAssigned'
        userAssignedIdentities: {
            '${managedIdentity.id}': {}
        }
    }
    sku: {
        name: sku
        size: sku
    }
}

resource swaFunctionAppLink 'Microsoft.Web/staticSites/userProvidedFunctionApps@2022-03-01' = {
    name: 's118-${environment}-itf-acs-portal-swa-fa'
    parent: swa
    properties: {
        functionAppRegion: functionApp.location
        functionAppResourceId: functionApp.id
    }
}

resource swaAppSettings 'Microsoft.Web/staticSites/config@2022-03-01' = {
    name: 'functionappsettings'
    kind: 'string'
    parent: swa
    properties: {
        Dynamics__EnvironmentUrl: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--EnvironmentUrl)'
        Dynamics__TenantId: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--TenantId)'
        Dynamics__ClientId: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--ClientId)'
        Dynamics__ClientSecret: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--ClientSecret)'
    }
}
