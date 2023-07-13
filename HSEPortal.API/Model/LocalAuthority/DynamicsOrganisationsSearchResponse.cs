namespace HSEPortal.API.Model.LocalAuthority;

public record DynamicsOrganisationsSearchResponse(DynamicsOrganisation[] value);
public record DynamicsOrganisation(string name, string accountid);