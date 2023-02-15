using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenValidatingApplicationNumber : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;

    public WhenValidatingApplicationNumber()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, new OTPService());
    }

    [Fact]
    public void ShouldReturnOkWhenApplicationExists()
    {
        var applicationId = "RegistrationId";
        var contactEmailAddress = "ContactEmailAddress";

        var applicationsInjectedByCosmos = new List<BuildingApplicationModel>
        {
            new(applicationId, "BuildingName", "ContactFirstName", "ContactLastName", "ContactPhoneNumber", contactEmailAddress)
        };

        var response = buildingApplicationFunctions.ValidateApplicationNumber(BuildHttpRequestDataWithParameters(applicationId, contactEmailAddress), applicationsInjectedByCosmos);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public void ShouldReturnBadRequestIfApplicationDoesNotExist()
    {
        var applicationId = "RegistrationId";
        var contactEmailAddress = "ContactEmailAddress";

        var response = buildingApplicationFunctions.ValidateApplicationNumber(BuildHttpRequestDataWithParameters(applicationId, contactEmailAddress), new List<BuildingApplicationModel>());

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}