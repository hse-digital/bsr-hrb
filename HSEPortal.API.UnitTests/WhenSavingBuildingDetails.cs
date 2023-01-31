using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

public class WhenSavingBuildingDetails : UnitTestBase
{
    private BuildingFunctions buildingFunctions = null!;

    protected override void AdditionalSetup()
    {
        buildingFunctions = new BuildingFunctions();
    }

    [Test]
    public async Task ShouldCallDynamicsWithBuildingDetails()
    {
        var buildingDetails = GivenBuildingDetails();
        await WhenCallingBuildingFunction(buildingDetails);

        HttpTest.ShouldHaveCalled("https://dynamicsapi")
            .WithRequestJson(buildingDetails);
    }

    private static BuildingDetails GivenBuildingDetails()
    {
        return new BuildingDetails
        {
            BuildingName = "BuildingName",
            Height = 12.5,
            FloorsAbove = 500,
            ResidentialUnits = 10,
            PeopleLivingInBuilding = PeopleLivingInBuilding.Yes
        };
    }

    private async Task WhenCallingBuildingFunction(BuildingDetails buildingDetails)
    {
        var requestData = BuildHttpRequestData(buildingDetails);
        await buildingFunctions.SaveBuildingDetails(requestData);
    }
}