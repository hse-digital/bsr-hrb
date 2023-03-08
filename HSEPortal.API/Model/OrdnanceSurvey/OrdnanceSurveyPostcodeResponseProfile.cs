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
            .ForMember(x => x.Address, x => x.MapFrom(y => y.LPI != null ? y.LPI.ADDRESS : y.DPA.ADDRESS))
            .ForMember(x => x.Number, x => x.MapFrom(y => y.LPI != null ? y.LPI.PAO_START_NUMBER : string.Empty))
            .ForMember(x => x.UPRN, x => x.MapFrom(y => y.LPI != null ? y.LPI.UPRN : y.DPA.UPRN))
            .ForMember(x => x.USRN, x => x.MapFrom(y => y.LPI != null ? y.LPI.USRN : y.DPA.USRN))
            .ForMember(x => x.Postcode, x => x.MapFrom(y => y.LPI != null ? y.LPI.POSTCODE_LOCATOR : y.DPA.POSTCODE))
            .ForMember(x => x.Street, x => x.MapFrom(y => y.LPI != null ? y.LPI.STREET_DESCRIPTION : y.DPA.THOROUGHFARE_NAME))
            .ForMember(x => x.Town, x => x.MapFrom(y => y.LPI != null ? y.LPI.TOWN_NAME : y.DPA.POST_TOWN))
            .ForMember(x => x.AdministrativeArea, x => x.MapFrom(y => y.LPI != null ? y.LPI.ADMINISTRATIVE_AREA : string.Empty))
            .ForMember(x => x.BuildingName, x => x.MapFrom(y => y.LPI != null ? y.LPI.PAO_TEXT : y.DPA.SUB_BUILDING_NAME));
    }
}