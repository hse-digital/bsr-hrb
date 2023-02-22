using FluentAssertions;
using HSEPortal.API.Functions;
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


    public WhenGettingPayment()
    {

        paymentFunctions = new PaymentFunctions(GetMapper());
    }

    [Fact]
    public async Task ShouldGetPaymentInformation()
    {
        string paymentId = "1234";
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled(PaymentFunctions.baseURL);
        HttpTest.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(string paymentId)
    {
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);

        HttpTest.ShouldHaveCalled(PaymentFunctions.baseURL);
        HttpTest.Should().Be(HttpStatusCode.BadRequest);
    }


}
