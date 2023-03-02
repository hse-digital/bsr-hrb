using FluentAssertions;
using HSEPortal.API.Functions;
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
        var paymentRequestModel = new PaymentRequestModel()
        {
            Amount = 100,
            Description = "Description",
            Reference = "abc1234",
            ReturnLink = ""
        };

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{this.integrationOptions.PaymentEndpoint}/v1/payments"));

        await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldHaveCalled(this.integrationOptions.PaymentEndpoint).WithVerb(HttpMethod.Post);
        HttpTest.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(1000000000)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(int amount)
    {
        var paymentRequestModel = new PaymentRequestModel()
        {
            Amount = amount,
            Description = "Description",
            Reference = "abc1234",
            ReturnLink = ""
        };

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{this.integrationOptions.PaymentEndpoint}/v1/payments"));

        await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldHaveCalled(this.integrationOptions.PaymentEndpoint);
        HttpTest.Should().Be(HttpStatusCode.BadRequest);
    }


}
