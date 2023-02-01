using HSEPortal.API.Functions;
using NUnit.Framework;
using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests;

public class WhenSavingContact : UnitTestBase
{
    private ContactFunctions contactFunctions = null!;

    protected override void AdditionalSetup()
    {
        contactFunctions = new ContactFunctions(DynamicsService);
    }

    [Test]
    public async Task ShouldCallDynamicsWithContactData()
    {
        var contactDetails = GivenAContact();
        await WhenCallingContactFunction(contactDetails);

        HttpTest.ShouldHaveCalled($"{DynamicsEnvironmentUrl}/contacts")
            .WithRequestJson(new DynamicsContact
            {
                contactid = contactDetails.Id,
                firstname = contactDetails.FirstName,
                lastname = contactDetails.LastName,
                telephone1 = contactDetails.PhoneNumber,
                emailaddress1 = contactDetails.Email
            });
    }

    private static Contact GivenAContact()
    {
        return new Contact
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "First Name",
            LastName = "Last Name",
            PhoneNumber = "+441234567890",
            Email = "email@email.com"
        };
    }

    private async Task WhenCallingContactFunction(Contact contact)
    {
        var requestData = BuildHttpRequestData(contact);
        await contactFunctions.SaveContactDetailsName(requestData);
    }
}