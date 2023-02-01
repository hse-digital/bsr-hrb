using FluentAssertions;
using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

[TestFixture]
public abstract class WhenGettingDynamicsModelDefinition<TEntity, TDynamicsEntity> where TEntity : Entity 
    where TDynamicsEntity : DynamicsEntity<TEntity>
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
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        modelDefinition.Should().NotBeNull();
    }

    [Test]
    public void ShouldReturnEndpoint()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        modelDefinition.Endpoint.Should().Be(Endpoint);
    }
}