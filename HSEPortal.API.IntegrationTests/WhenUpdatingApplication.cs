using FluentAssertions;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.IntegrationTests;

public class WhenUpdatingApplication : IntegrationTestBase
{
    private readonly IOptions<SwaOptions> swaOptions;
    private readonly OTPService otpService;
    private const string validApplicationId = "HBR170597960";
    private const string validEmailAddress = "dont@delete.com";

    public WhenUpdatingApplication(IOptions<SwaOptions> swaOptions, OTPService otpService)
    {
        this.swaOptions = swaOptions;
        this.otpService = otpService;
    }

    [Fact]
    public async Task ShouldUpdateApplicationInCosmos()
    {
        var application = new BuildingApplicationModel(validApplicationId, "new_building_name", "new_contact_first_name", "new_contact_last_name", "+44 808 157 0192", validEmailAddress);
        
        await swaOptions.Value.Url.AppendPathSegments("api", "UpdateApplication", validApplicationId).PutJsonAsync(application);
        
        var token = otpService.GenerateToken(validEmailAddress);
        var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication", validApplicationId, validEmailAddress, token).GetJsonAsync<BuildingApplicationModel>();

        response.ContactFirstName.Should().Be(application.ContactFirstName);
        response.ContactLastName.Should().Be(application.ContactLastName);
        response.ContactPhoneNumber.Should().Be(application.ContactPhoneNumber);
        response.BuildingName.Should().Be(application.BuildingName);
    }
}