param swaName string
param swaLocation string

@allowed([ 'Free', 'Standard' ])
param sku string = 'Standard'

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
    name: swaName
    location: swaLocation
    tags: null
    properties: {}
    sku: {
        name: sku
        size: sku
    }
}

output swaToken string = swa.properties.repositoryToken
