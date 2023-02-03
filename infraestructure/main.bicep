param environment string
param location string = resourceGroup().location
param swaLocation string = 'westeurope'

@allowed([ 'Free', 'Standard' ])
param sku string = 'Standard'

param keyVaultSku object = {
    name: 'standard'
    family: 'A'
}

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
    name: 's118-${environment}-itf-acs-portal-identity'
    location: location
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
    name: 's118-${environment}-itf-acs-kv'
    location: location
    properties: {
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

resource swaAppSettings 'Microsoft.Web/staticSites/config@2022-03-01' = {
    name: 'appsettings'
    kind: 'string'
    parent: swa
    properties: {
        Dynamics__EnvironmentUrl: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}Dynamics--EnvironmentUrl)'
        Dynamics__TenantId: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}Dynamics--TenantId)'
        Dynamics__ClientId: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}Dynamics--ClientId)'
        Dynamics__ClientSecret: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}Dynamics--ClientSecret)'
    }
}
