using AutoMapper;

namespace HSEPortal.API.Model.OrdnanceSurvey;

public class OrdnanceSurveyPostcodeResponseProfile : Profile
{
    public OrdnanceSurveyPostcodeResponseProfile()
    {
        CreateMap<OrdnanceSurveyPostcodeResponse, BuildingAddressSearchResponse>()
            .ForMember(x => x.Offset, x => x.MapFrom(y => y.header.offset))
            .ForMember(x => x.MaxResults, x => x.MapFrom(y => y.header.maxresults))
            .ForMember(x => x.TotalResults, x => x.MapFrom(y => y.header.totalresults));

        CreateMap<Result, BuildingAddress>()
            .ForMember(x => x.Address, x => x.MapFrom(y => y.LPI.ADDRESS))
            .ForMember(x => x.UPRN, x => x.MapFrom(y => y.LPI.UPRN))
            .ForMember(x => x.Postcode, x => x.MapFrom(y => y.LPI.POSTCODE_LOCATOR))
            .ForMember(x => x.Street, x => x.MapFrom(y => y.LPI.STREET_DESCRIPTION))
            .ForMember(x => x.Town, x => x.MapFrom(y => y.LPI.TOWN_NAME))
            .ForMember(x => x.AdministrativeArea, x => x.MapFrom(y => y.LPI.ADMINISTRATIVE_AREA))
            .ForMember(x => x.BuildingName, x => x.MapFrom(y => y.LPI.PAO_TEXT));

    }
}