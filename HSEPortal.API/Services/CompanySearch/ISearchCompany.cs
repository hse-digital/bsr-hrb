using HSEPortal.API.Model;

namespace HSEPortal.API.Services.CompanySearch;

public interface ISearchCompany
{
    Task<CompanySearchResponse> SearchCompany(string company);
}