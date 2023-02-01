using HSEPortal.API.Functions;
using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

public class WhenSavingBuildingDetails : UnitTestBase
{
    private BuildingFunctions buildingFunctions = null!;

    protected override void AdditionalSetup()
    {
        buildingFunctions = new BuildingFunctions(DynamicsService);
    }

    [Test]
    public async Task ShouldCallDynamicsWithBuildingDetails()
    {
        var buildingDetails = GivenBuildingDetails();
        await WhenCallingBuildingFunction(buildingDetails);

        HttpTest.ShouldHaveCalled($"{DynamicsEnvironmentUrl}/bsr_blocks")
            .WithRequestJson(new
            {
                bsr_blockid = buildingDetails.Id,
                bsr_numberofresidentialunits = buildingDetails.ResidentialUnits,
                bsr_arepeoplelivingintheblock = buildingDetails.PeopleLivingInBlock,
                bsr_blockheightinmetres = buildingDetails.Height,
                bsr_nooffloorsabovegroundlevel = buildingDetails.FloorsAbove
            });
    }

    private static BuildingDetails GivenBuildingDetails()
    {
        return new BuildingDetails
        {
            Id = Guid.NewGuid().ToString(),
            BuildingName = "BuildingName",
            Height = 12.5,
            FloorsAbove = 500,
            ResidentialUnits = 10,
            PeopleLivingInBlock = PeopleLivingInBuilding.Yes
        };
    }

    private async Task WhenCallingBuildingFunction(BuildingDetails buildingDetails)
    {
        var requestData = BuildHttpRequestData(buildingDetails);
        await buildingFunctions.SaveBuildingDetails(requestData);
    }
}