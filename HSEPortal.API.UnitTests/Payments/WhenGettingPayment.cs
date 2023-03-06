using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenGettingPayment : UnitTestBase
{
    private readonly PaymentFunctions paymentFunctions;
    private readonly IntegrationsOptions integrationOptions;

    public WhenGettingPayment()
    {
        integrationOptions = new IntegrationsOptions { PaymentEndpoint = "https://publicapi.payments.service.gov.uk", PaymentApiKey = "abc123" };
        paymentFunctions = new PaymentFunctions(new OptionsWrapper<IntegrationsOptions>(integrationOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldGetPaymentInformation()
    {
        PaymentApiResponseModel responseApiModel = this.CreatePaymentApiResponse();
        HttpTest.RespondWithJson(responseApiModel);

        string paymentId = "1234";
        var response = await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled($"{this.integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}")
                .WithVerb(HttpMethod.Get);

        PaymentResponseModel paymentResponseModel = await response.ReadAsJsonAsync<PaymentResponseModel>();

        paymentResponseModel.Status.Should().Be(responseApiModel.state.status);
        paymentResponseModel.Finished.Should().Be(responseApiModel.state.finished);
        paymentResponseModel.LinkSelf.Should().Be(responseApiModel._links.self.href);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(string paymentId)
    {
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldNotHaveCalled($"{this.integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}");
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

