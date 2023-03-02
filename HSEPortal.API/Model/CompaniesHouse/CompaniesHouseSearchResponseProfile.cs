using AutoMapper;

namespace HSEPortal.API.Model.CompaniesHouse;

public class CompaniesHouseSearchResponseProfile : Profile
{
    public CompaniesHouseSearchResponseProfile()
    {
        CreateMap<CompaniesHouseSearchResponse, CompanySearchResponse>()
            .ForMember(x => x.Results, x => x.MapFrom(y => y.hits))
            .ForMember(x => x.Companies, x => x.MapFrom(y => y.items));

        CreateMap<CompanyItem, Company>()
            .ForMember(x => x.Number, x => x.MapFrom(y => y.company_number))
            .ForMember(x => x.Name, x => x.MapFrom(y => y.company_name))
            .ForMember(x => x.Status, x => x.MapFrom(y => y.company_status))
            .ForMember(x => x.Type, x => x.MapFrom(y => y.company_type));
    }
}