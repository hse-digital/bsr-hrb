using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class LocalAuthorityModelDefinition : DynamicsModelDefinition<LocalAuthority, DynamicsLocalAuthority>
{
    public override string Endpoint => $"accounts";

    public override DynamicsLocalAuthority BuildDynamicsEntity(LocalAuthority entity)
    {
        DynamicsLocalAuthorityValue[] value = entity.value.Select(x => new DynamicsLocalAuthorityValue(x.etag, x.name, x.accountid)).ToArray();
        return new DynamicsLocalAuthority(entity.context, value);
    }

    public override LocalAuthority BuildEntity(DynamicsLocalAuthority dynamicsLocalAuthority)
    {
        LocalAuthorityValue[] value = dynamicsLocalAuthority.value.Select(x => new LocalAuthorityValue(x.etag, x.name, x.accountid)).ToArray();
        return new LocalAuthority(dynamicsLocalAuthority.context, value);
    }
}