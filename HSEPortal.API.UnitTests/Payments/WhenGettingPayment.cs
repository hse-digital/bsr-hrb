using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
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
        string paymentId = "1234";
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled(this.integrationOptions.PaymentEndpoint).WithVerb(HttpMethod.Get);
        HttpTest.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(string paymentId)
    {
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled(this.integrationOptions.PaymentEndpoint);
        HttpTest.Should().Be(HttpStatusCode.BadRequest);
    }


}
