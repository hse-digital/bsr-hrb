using AutoMapper;
using HSEPortal.API.Functions;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;

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
            .ForMember(x => x.ProviderId, x => x.MapFrom(y => y.provider_id))
            .ForPath(x => x.LastFourDigitsCardNumber, x => x.MapFrom(y => y.card_details.last_digits_card_number))
            .ForPath(x => x.CardExpiryDate, x => x.MapFrom(y => y.card_details.expiry_date))
            .ForPath(x => x.AddressLineOne, x => x.MapFrom(y => y.card_details.billing_address.line1))
            .ForPath(x => x.AddressLineTwo, x => x.MapFrom(y => y.card_details.billing_address.line2))
            .ForPath(x => x.Postcode, x => x.MapFrom(y => y.card_details.billing_address.postcode))
            .ForPath(x => x.City, x => x.MapFrom(y => y.card_details.billing_address.city))
            .ForPath(x => x.Country, x => x.MapFrom(y => y.card_details.billing_address.country))
            .ForPath(x => x.CardBrand, x => x.MapFrom(y => y.card_details.card_brand))
            .ForPath(x => x.CardType, x => x.MapFrom(y => y.card_details.card_type));

        CreateMap<PaymentRequestModel, PaymentApiRequestModel>()
            .ForMember(x => x.amount, x => x.MapFrom(y => y.Amount))
            .ForMember(x => x.reference, x => x.MapFrom(y => y.Reference))
            .ForMember(x => x.description, x => x.MapFrom(y => y.Description))
            .ForMember(x => x.return_url, x => x.MapFrom(y => y.ReturnLink));
    }

}
