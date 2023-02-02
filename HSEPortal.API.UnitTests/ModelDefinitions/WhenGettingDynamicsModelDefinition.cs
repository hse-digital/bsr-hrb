using FluentAssertions;
using HSEPortal.Domain.DynamicsDefinitions;
using HSEPortal.Domain.Entities;
using Xunit;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public abstract class WhenGettingDynamicsModelDefinition<TEntity, TDynamicsEntity> where TEntity : Entity
    where TDynamicsEntity : DynamicsEntity<TEntity>
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    protected abstract string Endpoint { get; }


    protected WhenGettingDynamicsModelDefinition()
    {
        dynamicsModelDefinitionFactory = new DynamicsModelDefinitionFactory();
    }

    [Fact]
    public void ShouldReturnModelDefinition()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        modelDefinition.Should().NotBeNull();
    }

    [Fact]
    public void ShouldReturnEndpoint()
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        modelDefinition.Endpoint.Should().Be(Endpoint);
    }
}