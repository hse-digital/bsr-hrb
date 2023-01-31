using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

[TestFixture]
public abstract class WhenGettingDynamicsModelDefinition<T> where T : DynamicsEntity
{
    private DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory = null!;
    protected abstract string Endpoint { get; }

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
    }
}

public class WhenGettingContactDetailsModelDefinition : WhenGettingDynamicsModelDefinition<ContactDetails>
{
    protected override string Endpoint => "contacts";
}

public class WhenGettingBuildingDetailsModelDefinition : WhenGettingDynamicsModelDefinition<BuildingDetails>
{
    protected override string Endpoint => "bsr_blocks";
}