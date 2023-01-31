param swaName string
param location string = resourceGroup().location

@allowed([ 'Free', 'Standard' ])
param sku string = 'Standard'

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
    name: swaName
    location: location
    tags: null
    properties: {}
    sku: {
        name: sku
        size: sku
    }
}

output swaToken string = swa.properties.repositoryToken
