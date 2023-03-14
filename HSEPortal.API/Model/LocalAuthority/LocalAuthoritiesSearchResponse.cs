namespace HSEPortal.API.Model.LocalAuthority;

public record LocalAuthoritiesSearchResponse(LocalAuthority[] value);
public record LocalAuthority(string name, string accountid);