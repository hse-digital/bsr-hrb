using System.Text.Json;
using FluentAssertions;
using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

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
        modelDefinition.Should().NotBeNull();
    }

    [Test]
    public void ShouldReturnEndpoint()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        modelDefinition.Endpoint.Should().Be(Endpoint);
    }

    [Test]
    public void ShouldMapModelToDynamicsModel()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        var dynamicsModel = modelDefinition.BuildDynamicsModel(DynamicsEntity);

        JsonSerializer.Serialize(dynamicsModel).Should().Be(JsonSerializer.Serialize(DynamicsModel));
    }
}