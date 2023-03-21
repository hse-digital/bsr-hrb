using HSEPortal.API.Model;
using HSEPortal.API.Model.SocialHousing;

namespace HSEPortal.API.Services.CompanySearch;

public class SocialHousingSearch : ISearchCompany
{
    public Task<CompanySearchResponse> SearchCompany(string company)
    {
        var companies = SocialHousingDataset.Records.Where(x => x.organisation_name.ToLower().Contains(company.ToLower())).ToArray();
        return Task.FromResult(new CompanySearchResponse
        {
            Results = companies.Length,
            Companies = companies.Select(x => new Company
            {
                Name = x.organisation_name,
                Number = x.registration_number,
                Type = x.designation
            }).ToList()
        });
    }
}