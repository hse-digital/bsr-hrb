using HSEPortal.API.Functions;
using NUnit.Framework;
using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests;

public class WhenSavingContactDetails : UnitTestBase
{
    private ContactFunctions contactFunctions = null!;

    protected override void AdditionalSetup()
    {
        contactFunctions = new ContactFunctions(DynamicsService);
    }

    [Test]
    public async Task ShouldCallDynamicsWithContactDetails()
    {
        var contactDetails = GivenContactDetails();
        await WhenCallingContactFunction(contactDetails);

        HttpTest.ShouldHaveCalled($"{DynamicsEnvironmentUrl}/contacts")
            .WithRequestJson(new
            {
                contactid = contactDetails.Id,
                firstname = contactDetails.FirstName,
                lastname = contactDetails.LastName,
                emailaddress1 = contactDetails.Email,
                telephone1 = contactDetails.PhoneNumber
            });
    }

    private static ContactDetails GivenContactDetails()
    {
        return new ContactDetails
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "First Name",
            LastName = "Last Name",
            PhoneNumber = "+441234567890",
            Email = "email@email.com"
        };
    }

    private async Task WhenCallingContactFunction(ContactDetails contactDetails)
    {
        var requestData = BuildHttpRequestData(contactDetails);
        await contactFunctions.SaveContactDetailsName(requestData);
    }
}