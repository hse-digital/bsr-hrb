using Azure;
using Flurl.Http;
using Flurl.Http.Testing;
using Microsoft.Azure.Functions.Worker.Http;
using NUnit.Framework;
using System.Net;

namespace HSEPortal.API.UnitTests;

[TestFixture]
public class WhenSavingContactDetails
{
    private HttpTest httpTest;
    private ContactFunctions contactFunctions;

    [SetUp]
    public void Setup()
    {
        httpTest = new HttpTest();
        contactFunctions = new ContactFunctions();
    }

    [Test]
    [Category("ContactDetailsName")]
    public async Task ShouldCallDynamicsWithContactDetailsName()
    {
        HttpRequestMessage request = new HttpRequestMessage();
        request.Headers.Add("firstName", "First Name");
        request.Headers.Add("lastName", "Last Name");

        IFlurlResponse response = await contactFunctions.SaveContactDetailsName(request);

        httpTest.ShouldHaveCalled("https://dynamicsapi")
                .WithRequestJson(new { firstName = "First Name", lastName = "Last Name" });

        Assert.AreEqual(200, response.StatusCode);
    }

    [Test]
    [Category("ContactDetailsPhoneNumber")]
    public async Task ShouldCallDynamicsWithContactDetailsPhoneNumber()
    {
        HttpRequestMessage request = new HttpRequestMessage();
        request.Headers.Add("phoneNumber", "+441234567890");

        IFlurlResponse response = await contactFunctions.SaveContactDetailsPhoneNumber(request);

        httpTest.ShouldHaveCalled("https://dynamicsapi")
                .WithRequestJson(new { phoneNumber = "+441234567890" });

        Assert.AreEqual(200, response.StatusCode);
    }

    [Test]
    [Category("ContactDetailsEmail")]
    public async Task ShouldCallDynamicsWithContactDetailsEmail()
    {
        HttpRequestMessage request = new HttpRequestMessage();
        request.Headers.Add("email", "email@email.com");

        IFlurlResponse response = await contactFunctions.SaveContactDetailsEmail(request);

        httpTest.ShouldHaveCalled("https://dynamicsapi")
                .WithRequestJson(new { email = "email@email.com" });

        Assert.AreEqual(200, response.StatusCode);
    }
}