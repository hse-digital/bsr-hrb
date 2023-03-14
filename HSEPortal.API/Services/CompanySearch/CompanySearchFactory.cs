using AutoMapper;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services.CompanySearch;

public class CompanySearchFactory
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationsOptions;
    private readonly DynamicsService dynamicsService;

    public CompanySearchFactory(IOptions<IntegrationsOptions> integrationsOptions, DynamicsService dynamicsService, IMapper mapper)
    {
        this.mapper = mapper;
        this.dynamicsService = dynamicsService;
        this.integrationsOptions = integrationsOptions.Value;
    }

    public ISearchCompany GetSearchCompanyInstance(string companyType)
    {
        switch (companyType)
        {
            case "commonhold-association":
            case "management-company":
            case "rmc-or-organisation":
            case "rtm-or-organisation":
            case "other":
                return new CompaniesHouseSearch(integrationsOptions, mapper);
            case "housing-association":
                return new SocialHousingSearch();
            case "local-authority":
                return new LocalAuthoritySearch(dynamicsService, mapper);
        }

        return null;
    }
}