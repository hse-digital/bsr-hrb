using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using NUnit.Framework;
using NUnit.Framework.Constraints;

namespace HSEPortal.API.UnitTests;

[TestFixture]
public abstract class WhenGettingDynamicsModelDefinition<T> where T : DynamicsEntity
{
    private DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory = null!;
    protected abstract string Endpoint { get; }
    protected abstract T DynamicsEntity { get; }
    protected abstract object DynamicsModel { get; }

    [SetUp]
    public void Setup()
    {
        dynamicsModelDefinitionFactory = new DynamicsModelDefinitionFactory();
    }

    [Test]
    public void ShouldReturnModelDefinition()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        Assert.NotNull(modelDefinition);
    }

    [Test]
    public void ShouldReturnEndpoint()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        Assert.AreEqual(modelDefinition.Endpoint, Endpoint);
    }

    [Test]
    public void ShouldMapModelToDynamicsModel()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        var dynamicsModel = modelDefinition.BuildDynamicsModel(DynamicsEntity);

        Assert.IsTrue(NUnitComparer.Equals(dynamicsModel, DynamicsModel));
    }
}

public class WhenGettingContactDetailsModelDefinition : WhenGettingDynamicsModelDefinition<ContactDetails>
{
    protected override string Endpoint => "contacts";
    protected override ContactDetails DynamicsEntity { get; } = new ContactDetails
    {
        Id = "1",
        FirstName = "abc",
        LastName = "def",
        Email = "email@email.com",
        PhoneNumber = "+441234567896"
    };
    protected override object DynamicsModel { get; } = new
    {
        contactid = "1",
        firstname = "abc",
        lastname = "def",
        emailaddress1 = "email@email.com",
        telephone1 = "+441234567896"
    };
}

public class WhenGettingBuildingDetailsModelDefinition : WhenGettingDynamicsModelDefinition<BuildingDetails>
{
    protected override string Endpoint => "bsr_blocks";
    protected override BuildingDetails DynamicsEntity { get; } = new BuildingDetails()
    {
        Id = "1",
        FloorsAbove = 300,
        Height = 800.5,
        PeopleLivingInBlock = PeopleLivingInBuilding.Yes,
        ResidentialUnits = 500
    };
    protected override object DynamicsModel { get; } = new
    {
        bsr_blockid = "1",
        bsr_numberofresidentialunits = 500,
        bsr_arepeoplelivingintheblock = PeopleLivingInBuilding.Yes,
        bsr_blockheightinmetres = 800.5,
        bsr_nooffloorsabovegroundlevel = 300,
    };
}