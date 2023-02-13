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

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
    name: 's118-${environment}-itf-acs-cosmos'
    location: location
    kind: 'GlobalDocumentDB'
    properties: {
        publicNetworkAccess: 'Enabled'
        consistencyPolicy: {
            defaultConsistencyLevel: 'Session'
        }
        locations: [
            {
                locationName: location
                failoverPriority: 0
                isZoneRedundant: false
            }
        ]
        capabilities: [
            {
                name: 'EnableServerless'
            }
        ]
        databaseAccountOfferType: 'Standard'
    }
}

var databaseName = 'hseportal'
resource cosmosDB 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
    parent: cosmos
    name: databaseName
    properties: {
        resource: {
            id: databaseName
        }
    }
}

var containerName = 'building-registrations'
resource container 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
    parent: cosmosDB
    name: containerName
    properties: {
        resource: {
            id: containerName
            partitionKey: {
                paths: [
                    '/id'
                ]
                kind: 'Hash'
            }
            defaultTtl: 86400
        }
    }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
    name: 's118-${environment}-itf-acs-ai'
    location: location
    kind: 'web'
    properties: {
        Application_Type: 'web'
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
        keyVaultReferenceIdentity: managedIdentity.id
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
                {
                    name: 'FUNCTIONS_EXTENSION_VERSION'
                    value: '~4'
                }
                {
                    name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
                    value: appInsights.properties.InstrumentationKey
                }
                {
                    name: 'Dynamics__EmailVerificationFlowUrl'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--EmailVerificationFlowUrl)'
                }
                {
                    name: 'Dynamics__EnvironmentUrl'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--EnvironmentUrl)'
                }
                {
                    name: 'Dynamics__TenantId'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--TenantId)'
                }
                {
                    name: 'Dynamics__ClientId'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--ClientId)'
                }
                {
                    name: 'Dynamics__ClientSecret'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--ClientSecret)'
                }
                {
                    name: 'CosmosConnection'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=CosmosConnection)'
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
    properties: {
    }
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

resource swaAppSettings 'Microsoft.Web/staticSites/config@2022-03-01' = {
    name: 'appsettings'
    kind: 'string'
    parent: swa
    properties: {
        APPINSIGHTS_INSTRUMENTATIONKEY: appInsights.properties.InstrumentationKey
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
