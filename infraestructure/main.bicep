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
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
    name: 's118-${environment}-bsr-acs-workspace'
    location: location
    properties: {
        sku: {
            name: 'PerGB2018'
        }
        retentionInDays: 30
    }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
    name: 's118-${environment}-bsr-acs-ai'
    location: location
    kind: 'web'
    properties: {
        Application_Type: 'web'
        WorkspaceResourceId: logAnalyticsWorkspace.id
        Request_Source: 'rest'
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

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' existing = {
    name: 's118-${environment}-bsr-acs-bus'
}

resource syncAccountablePersonsQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-accountable-persons'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncBuildingStructuresQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-building-structures'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncCertificateDeclarationQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-certificate-declaration'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncDeclarationQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-declaration'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncKbiBuildingUseQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-kbi-building-use'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncKbiConnectionsQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-kbi-connections'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncKbiFireEnergyQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-kbi-fire-energy'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncKbiRoofQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-kbi-roof'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncKbiStartQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-kbi-start'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncPaymentQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-payment'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource createBacQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'create-bac'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource updateBacQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'update-bac'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
}

resource syncBacStatusQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
    parent: serviceBusNamespace
    name: 'sync-bac-status'
    properties: {
        maxSizeInMegabytes: 1024
        lockDuration: 'PT5M'
    }
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
                    name: 'ServiceBusConnection'
                    value: 'Endpoint=sb://${serviceBusNamespace.name}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=${listKeys('${serviceBusNamespace.id}/AuthorizationRules/RootManageSharedAccessKey', serviceBusNamespace.apiVersion).primaryKey}'
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
                    name: 'Integrations__CertificateApplicationCharge'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CertificateApplicationCharge)'
                }
                {
                    name: 'Integrations__CertificateApplicationPerPersonCharge'
                    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=Integrations--CertificateApplicationPerPersonCharge)'
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