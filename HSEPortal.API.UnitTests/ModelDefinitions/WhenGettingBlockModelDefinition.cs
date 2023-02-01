using HSEPortal.Domain.Entities;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingBlockModelDefinition : WhenGettingDynamicsModelDefinition<Block, DynamicsBlock>
{
    protected override string Endpoint => "bsr_blocks";
}