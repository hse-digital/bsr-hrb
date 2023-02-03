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
    name: 's118-${environment}-itf-acs-portal-kv'
    location: location
    properties: {
        tenantId: tenant().tenantId
        sku: keyVaultSku
    }
}

// resource keyVaultAdministratorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
//     scope: subscription()
//     name: 'a6a49ec2-d19d-4bbc-aa86-384b6e00d2c0'
// }

// resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
//   name: guid(keyVault.name, managedIdentity.id, keyVaultAdministratorRoleDefinition.id, keyVault.id)
//   scope: keyVault
//   properties: {
//     roleDefinitionId: guid(keyVault.id, managedIdentity.properties.principalId, keyVaultAdministratorRoleDefinition.id)
//     principalId: managedIdentity.properties.principalId
//   }
// }

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
