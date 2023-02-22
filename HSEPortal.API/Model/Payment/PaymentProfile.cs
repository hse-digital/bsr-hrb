using AutoMapper;
using HSEPortal.API.Functions;

namespace HSEPortal.API.Model.Payment;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<PaymentApiResponseModel, PaymentResponseModel>()
            .ForMember(x => x.Amount, x => x.MapFrom(y => y.amount))
            .ForMember(x => x.CreatedDate, x => x.MapFrom(y => y.created_date))
            .ForMember(x => x.Status, x => x.MapFrom(y => y.state.status))
            .ForMember(x => x.Finished, x => x.MapFrom(y => y.state.finished))
            .ForMember(x => x.LinkSelf, x => x.MapFrom(y => y._links.self.href))
            .ForMember(x => x.Reference, x => x.MapFrom(y => y.reference))
            .ForMember(x => x.Description, x => x.MapFrom(y => y.description))
            .ForMember(x => x.ReturnURL, x => x.MapFrom(y => y.return_url))
            .ForMember(x => x.PaymentId, x => x.MapFrom(y => y.payment_id))
            .ForMember(x => x.PaymentProvider, x => x.MapFrom(y => y.payment_provider))
            .ForMember(x => x.ProviderId, x => x.MapFrom(y => y.provider_id));
    }

}
