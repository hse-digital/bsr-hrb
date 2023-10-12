param environment string
param location string = resourceGroup().location
param swaLocation string = 'westeurope'
param servicePrincipalId string

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
    name: 's118-${environment}-bsr-acs-portal-identity'
    location: location
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
    name: 's118-${environment}-bsr-acs-kv'
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
            {
                objectId: servicePrincipalId
                tenantId: tenant().tenantId
                permissions: {
                    secrets: [
                        'get'
                        'list'
                    ]
                }
            }
        ]
    }
}

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
    name: 's118-${environment}-bsr-acs-cosmos'
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
            defaultTtl: -1
        }
    }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
    name: 's118-${environment}-bsr-acs-ai'
    location: location
    kind: 'web'
    properties: {
        Application_Type: 'web'
    }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
    name: 's118${environment}bsracsportalsa'
    location: location
    sku: {
        name: storageAccountType
    }
    kind: 'Storage'
}

resource hostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
    name: 's118-${environment}-bsr-acs-portal-fa'
    location: location
    sku: {
        name: 'Y1'
        tier: 'Dynamic'
    }
    properties: {}
}

resource bsrFilesStorageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' existing = {
    name: 's118${environment}bsrfiles'
}

resource filesBlobServices 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' existing = {
    name: 'default'
    parent: bsrFilesStorageAccount
}

resource uploadsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
    name: 'hseuploads'
    parent: filesBlobServices
}

resource functionApp 'Microsoft.Web/sites@2021-03-01' = {
    name: 's118-${environment}-bsr-acs-portal-fa'
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
                    name: 'Dynamics__LocalAuthorityTypeId'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Dynamics--LocalAuthorityTypeId)'
                }
                {
                    name: 'Dynamics__UploadFileFlowUrl'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=SQUAD1--Dynamics--UploadFileFlowUrl)'
                }
                {
                    name: 'CosmosConnection'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=CosmosConnection)'
                }
                {
                    name: 'Integrations__OrdnanceSurveyEndpoint'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--OrdnanceSurveyEndpoint)'
                }
                {
                    name: 'Integrations__OrdnanceSurveyApiKey'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--OrdnanceSurveyApiKey)'
                }
                {
                    name: 'Integrations__CompaniesHouseEndpoint'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CompaniesHouseEndpoint)'
                }
                {
                    name: 'Integrations__CompaniesHouseApiKey'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CompaniesHouseApiKey)'
                }
                {
                    name: 'Integrations__PaymentEndpoint'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--PaymentEndpoint)'
                }
                {
                    name: 'Integrations__PaymentApiKey'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--PaymentApiKey)'
                }
                {
                    name: 'Integrations__PaymentAmount'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--PaymentAmount)'
                }
                {
                    name: 'Integrations__CommonAPIEndpoint'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CommonAPIEndpoint)'
                }
                {
                    name: 'Integrations__CommonAPIKey'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CommonAPIKey)'
                }
                {
                    name: 'Integrations__Environment'
                    value: environment
                }
                {
                    name: 'Swa__Url'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Swa--Url)'
                }
                {
                    name: 'Blob__ConnectionString'
                    value: 'DefaultEndpointsProtocol=https;AccountName=${bsrFilesStorageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${bsrFilesStorageAccount.listKeys().keys[0].value}'
                }
                {
                    name: 'Blob__ContainerName'
                    value: uploadsContainer.name
                }
                {
                    name: 'Feature__DisableOtpValidation'
                    value: 'false'
                }
            ]
        }
        httpsOnly: true
    }
}

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
    name: 's118-${environment}-bsr-acs-portal-swa'
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
    name: 's118-${environment}-bsr-acs-portal-swa-fa'
    parent: swa
    properties: {
        functionAppRegion: functionApp.location
        functionAppResourceId: functionApp.id
    }
}
