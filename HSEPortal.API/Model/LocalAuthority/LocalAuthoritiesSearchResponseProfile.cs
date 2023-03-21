using AutoMapper;

namespace HSEPortal.API.Model.LocalAuthority;

public class LocalAuthoritiesSearchResponseProfile : Profile
{
    public LocalAuthoritiesSearchResponseProfile()
    {
        CreateMap<LocalAuthoritiesSearchResponse, CompanySearchResponse>()
            .ForMember(x => x.Results, x => x.MapFrom(y => y.value.Length))
            .ForMember(x => x.Companies, x => x.MapFrom(y => y.value));

        CreateMap<LocalAuthority, Company>()
            .ForMember(x => x.Number, x => x.MapFrom(y => y.accountid))
            .ForMember(x => x.Name, x => x.MapFrom(y => y.name));
    }
}