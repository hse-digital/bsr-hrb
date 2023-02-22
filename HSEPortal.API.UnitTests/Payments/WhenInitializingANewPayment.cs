using FluentAssertions;
using HSEPortal.API.Functions;
using System.Net;
using Xunit;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenInitializingANewPayment : UnitTestBase
{
    private readonly PaymentFunctions paymentFunctions;


    public WhenInitializingANewPayment()
    {

        paymentFunctions = new PaymentFunctions(GetMapper());
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

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{PaymentFunctions.baseURL}/v1/payments"));

        await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldHaveCalled(PaymentFunctions.baseURL);
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

        var data = BuildHttpRequestDataWithUri(paymentRequestModel, new Uri($"{PaymentFunctions.baseURL}/v1/payments"));

        await paymentFunctions.InitialisePayment(data);

        HttpTest.ShouldHaveCalled(PaymentFunctions.baseURL);
        HttpTest.Should().Be(HttpStatusCode.BadRequest);
    }


}
