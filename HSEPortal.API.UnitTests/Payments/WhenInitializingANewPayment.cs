using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using System.Net;
using Xunit;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenInitializingANewPayment : UnitTestBase
{
    private readonly PaymentFunctions paymentFunctions;
    private readonly IntegrationsOptions integrationOptions;


    public WhenInitializingANewPayment()
    {
        integrationOptions = new IntegrationsOptions { PaymentEndpoint = "https://publicapi.payments.service.gov.uk", PaymentApiKey = "abc123" };
        paymentFunctions = new PaymentFunctions(new OptionsWrapper<IntegrationsOptions>(integrationOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldInitializePayment()
    {
        var apiResponse = this.CreatePaymentApiResponse();
        HttpTest.RespondWithJson(apiResponse);

        var paymentRequestModel = new PaymentRequestModel()
        {
            Reference = "12345"
        };

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{this.integrationOptions.PaymentEndpoint}/v1/payments"));

        var response = await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldHaveCalled($"{this.integrationOptions.PaymentEndpoint}/v1/payments")
                .WithVerb(HttpMethod.Post);

        PaymentResponseModel paymentResponseModel = await response.ReadAsJsonAsync<PaymentResponseModel>();

        paymentResponseModel.Status.Should().Be(apiResponse.state.status);
        paymentResponseModel.Finished.Should().Be(apiResponse.state.finished);
        paymentResponseModel.LinkSelf.Should().Be(apiResponse._links.self.href);


    }

    [Fact]
    public async Task ShouldReturnBadRequestIfValuesAreWrong()
    {
        var paymentApiResponse = this.CreatePaymentApiResponse();
        HttpTest.RespondWithJson(paymentApiResponse);

        var paymentRequestModel = new PaymentRequestModel()
        {
            Reference = ""
        };

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{this.integrationOptions.PaymentEndpoint}/v1/payments"));

        await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldNotHaveCalled($"{this.integrationOptions.PaymentEndpoint}/v1/payments");
    }

    public PaymentApiResponseModel CreatePaymentApiResponse()
    {
        return new PaymentApiResponseModel
        {
            created_date = "",
            state = new State() { finished = false, status = "created" },
            _links = new Links() { self = new Url() { href = "link" } },
            amount = 250,
            reference = "12345",
            description = "description",
            return_url = "https://your.service.gov.uk/completed",
            payment_id = "hu20sqlact5260q2nanm0q8u93",
            payment_provider = "worldpay",
            provider_id = "10987654321"
        };
    }

}
