using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenInitializingANewPayment : UnitTestBase
{
    private readonly PaymentFunctions paymentFunctions;
    private readonly IntegrationsOptions integrationOptions;
    private readonly SwaOptions swaOptions;
    private readonly string applicationId = "HBR123123123";
    private readonly PaymentApiResponseModel paymentApiResponse;
    private string returnUrl => $"{swaOptions.Url}/application/{applicationId}/confirm";

    public WhenInitializingANewPayment()
    {
        integrationOptions = new IntegrationsOptions { PaymentEndpoint = "https://publicapi.payments.service.gov.uk", PaymentApiKey = "abc123", PaymentAmount = 251 };
        swaOptions = new SwaOptions { Url = "http://localhost:4280" };
        paymentFunctions = new PaymentFunctions(new OptionsWrapper<IntegrationsOptions>(integrationOptions), new OptionsWrapper<SwaOptions>(swaOptions), GetMapper());

        paymentApiResponse = CreatePaymentApiResponse();
        HttpTest.RespondWithJson(paymentApiResponse);
    }

    [Fact]
    public async Task ShouldCallPaymentApiEndpoint()
    {
        var paymentRequestModel = BuildPaymentRequestModel();
        await paymentFunctions.InitialisePayment(BuildHttpRequestData(paymentRequestModel));

        HttpTest.ShouldHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments")
            .WithRequestJson(new PaymentApiRequestModel
            {
                amount = integrationOptions.PaymentAmount,
                reference = applicationId,
                return_url = returnUrl,
                delayed_capture = false,
                email = paymentRequestModel.Email,
                prefilled_cardholder_details = new ApiCardHolderDetails
                {
                    cardholder_name = paymentRequestModel.CardHolderDetails.Name,
                    billing_address = new ApiCardHolderAddress
                    {
                        line1 = paymentRequestModel.CardHolderDetails.Address.Line1,
                        line2 = paymentRequestModel.CardHolderDetails.Address.Line2,
                        postcode = paymentRequestModel.CardHolderDetails.Address.Postcode,
                        city = paymentRequestModel.CardHolderDetails.Address.City,
                    }
                }
            })
            .WithVerb(HttpMethod.Post);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(default(string))]
    public async Task ShouldReturnBadRequestIfValuesAreWrong(string reference)
    {
        var paymentRequestModel = new PaymentRequestModel { Reference = reference };

        var response = await paymentFunctions.InitialisePayment(BuildHttpRequestData(paymentRequestModel));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        HttpTest.ShouldNotHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments");
    }

    [Fact]
    public async Task ShouldReturnPaymentApiResponse()
    {
        var paymentRequestModel = BuildPaymentRequestModel();
        var response = await paymentFunctions.InitialisePayment(BuildHttpRequestData(paymentRequestModel));

        var paymentResponse = await response.ReadAsJsonAsync<PaymentResponseModel>();
        paymentResponse.Should().BeEquivalentTo(new PaymentResponseModel
        {
            CreatedDate = paymentApiResponse.created_date,
            Status = paymentApiResponse.state.status,
            Finished = paymentApiResponse.state.finished,
            PaymentLink = paymentApiResponse._links.self.href,
            Amount = paymentApiResponse.amount,
            Reference = paymentApiResponse.reference,
            Description = paymentApiResponse.description,
            ReturnURL = paymentApiResponse.return_url,
            PaymentId = paymentApiResponse.payment_id,
            PaymentProvider = paymentApiResponse.payment_provider,
            ProviderId = paymentApiResponse.provider_id,
            CardBrand = paymentApiResponse.card_details.card_brand,
            CardType = paymentApiResponse.card_details.card_type,
            CardExpiryDate = paymentApiResponse.card_details.expiry_date,
            LastFourDigitsCardNumber = paymentApiResponse.card_details.last_digits_card_number,
            AddressLineOne = paymentApiResponse.card_details.billing_address.line1,
            AddressLineTwo = paymentApiResponse.card_details.billing_address.line2,
            City = paymentApiResponse.card_details.billing_address.city,
            Postcode = paymentApiResponse.card_details.billing_address.postcode,
            Country = paymentApiResponse.card_details.billing_address.country
        });
    }

    private PaymentRequestModel BuildPaymentRequestModel()
    {
        var paymentRequestModel = new PaymentRequestModel
        {
            Reference = applicationId,
            ReturnUrl = returnUrl,
            Email = "user_email.com",
            CardHolderDetails = new CardHolderDetails
            {
                Name = "user name",
                Address = new CardHolderAddress
                {
                    Line1 = "address line 1",
                    Line2 = "address line 2",
                    Postcode = "erq 1234",
                    City = "gasglow"
                }
            }
        };
        return paymentRequestModel;
    }

    private PaymentApiResponseModel CreatePaymentApiResponse()
    {
        return new PaymentApiResponseModel
        {
            created_date = "",
            state = new State { finished = false, status = "created" },
            _links = new Links { self = new Url { href = "link" } },
            amount = 250,
            reference = applicationId,
            description = "description",
            return_url = "https://your.service.gov.uk/completed",
            payment_id = "hu20sqlact5260q2nanm0q8u93",
            payment_provider = "worldpay",
            provider_id = "10987654321",
            card_details = new CardDetails
            {
                card_brand = "mastercard",
                card_type = "credit",
                expiry_date = "now",
                last_digits_card_number = 1234,
                billing_address = new BillingAddress
                {
                    line1 = "line1",
                    line2 = "line2",
                    city = "city",
                    postcode = "postcode",
                    country = "GB"
                }
            }
        };
    }
}