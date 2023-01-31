using Flurl.Http.Testing;
using Microsoft.Azure.Functions.Worker.Http;
using NUnit.Framework;

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
    public async Task ShouldCallDynamicsWithContactData()
    {
        await contactFunctions.SaveContactDetails(new HttpRequestMessage());

        httpTest.ShouldHaveCalled("https://dynamicsapi");
    }
}