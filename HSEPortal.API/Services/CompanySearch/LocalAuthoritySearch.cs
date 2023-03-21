using AutoMapper;
using HSEPortal.API.Model;

namespace HSEPortal.API.Services.CompanySearch;

public class LocalAuthoritySearch : ISearchCompany
{
    private readonly DynamicsService dynamicsService;
    private readonly IMapper mapper;

    public LocalAuthoritySearch(DynamicsService dynamicsService, IMapper mapper)
    {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
    }

    public async Task<CompanySearchResponse> SearchCompany(string company)
    {
        var localAuthorityResponse = await dynamicsService.SearchLocalAuthorities(company);
        return mapper.Map<CompanySearchResponse>(localAuthorityResponse);
    }
}