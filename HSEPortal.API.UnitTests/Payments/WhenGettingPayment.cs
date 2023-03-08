using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenGettingPayment : UnitTestBase
{
    private readonly PaymentFunctions paymentFunctions;
    private readonly IntegrationsOptions integrationOptions;
    private readonly string paymentId = "1234";
    private readonly PaymentApiResponseModel responseApiModel;

    public WhenGettingPayment()
    {
        integrationOptions = new IntegrationsOptions { PaymentEndpoint = "https://publicapi.payments.service.gov.uk", PaymentApiKey = "abc123" };
        paymentFunctions = new PaymentFunctions(new OptionsWrapper<IntegrationsOptions>(integrationOptions), new OptionsWrapper<SwaOptions>(new SwaOptions { Url = "http://localhost:4280" }), GetMapper());

        responseApiModel = CreatePaymentApiResponse();
        HttpTest.RespondWithJson(responseApiModel);
    }

    [Fact]
    public async Task ShouldCallPaymentApiGetPayment()
    {
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}")
            .WithVerb(HttpMethod.Get);
    }

    [Fact]
    public async Task ShouldReturnPaymentResponseModel()
    {
        var response = await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);
        var paymentResponseModel = await response.ReadAsJsonAsync<PaymentResponseModel>();

        paymentResponseModel.Status.Should().Be(responseApiModel.state.status);
        paymentResponseModel.Email.Should().Be(responseApiModel.email);
        paymentResponseModel.Finished.Should().Be(responseApiModel.state.finished);
        paymentResponseModel.PaymentLink.Should().Be(responseApiModel._links.next_url.href);
        paymentResponseModel.CardType.Should().Be(responseApiModel.card_details.card_type);
        paymentResponseModel.CardBrand.Should().Be(responseApiModel.card_details.card_brand);
        paymentResponseModel.LastFourDigitsCardNumber.Should().Be(responseApiModel.card_details.last_digits_card_number);
        paymentResponseModel.AddressLineOne.Should().Be(responseApiModel.card_details.billing_address.line1);
        paymentResponseModel.Postcode.Should().Be(responseApiModel.card_details.billing_address.postcode);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(string id)
    {
        var response = await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, id), id);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        HttpTest.ShouldNotHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}");
    }

    private PaymentApiResponseModel CreatePaymentApiResponse()
    {
        return new PaymentApiResponseModel
        {
            created_date = "created_date",
            state = new State { finished = false, status = "created" },
            _links = new Links { next_url = new Url { href = "link" } },
            amount = 250,
            email = "user@email.com",
            reference = "12345",
            description = "description",
            return_url = "https://your.service.gov.uk/completed",
            payment_id = "hu20sqlact5260q2nanm0q8u93",
            payment_provider = "worldpay",
            provider_id = "10987654321",
            card_details = new CardDetails
            {
                card_type = "debit",
                card_brand = "Jcb",
                expiry_date = "expiry date",
                last_digits_card_number = "1234",
                first_digits_card_number = "12345",
                billing_address = new BillingAddress
                {
                    line1 = "line1",
                    line2 = "line2",
                    city = "city",
                    country = "country",
                    postcode = "postcode",
                }
            },
        };
    }
}