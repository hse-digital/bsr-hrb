using HSEPortal.API.Functions;
using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

public class WhenSavingBuilding : UnitTestBase
{
    private BuildingFunctions buildingFunctions = null!;

    protected override void AdditionalSetup()
    {
        buildingFunctions = new BuildingFunctions(DynamicsService);
    }

    [Test]
    public async Task ShouldCallDynamicsWithBuildingData()
    {
        var buildingDetails = GivenABuilding();
        await WhenCallingBuildingFunction(buildingDetails);

        HttpTest.ShouldHaveCalled($"{DynamicsEnvironmentUrl}/bsr_buildings")
            .WithRequestJson(new DynamicsBuilding
            {
                bsr_buildingid = buildingDetails.Id,
                bsr_name = buildingDetails.Name
            });
    }

    private static Building GivenABuilding()
    {
        return new Building
        {
            Id = Guid.NewGuid().ToString(),
            Name = "BuildingName"
        };
    }

    private async Task WhenCallingBuildingFunction(Building building)
    {
        var requestData = BuildHttpRequestData(building);
        await buildingFunctions.SaveBuildingDetails(requestData);
    }
}