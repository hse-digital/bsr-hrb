using System.Globalization;
using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;
public class StructureDefinition : DynamicsModelDefinition<Structure, DynamicsStructure>
{
    public override string Endpoint => "bsr_blocks";

    public override DynamicsStructure BuildDynamicsEntity(Structure entity)
    {
        var peopleLivingInStructure = GetPeopleLivingInStructure(entity.PeopleLivingInStructure);
        var constructionYearOption = GetConstructionYearOption(entity.ConstructionYearOption);
        
        var roundedHeight = (int)Math.Round(double.Parse(entity.HeightInMeters, CultureInfo.InvariantCulture));
        return new DynamicsStructure(entity.Name, int.Parse(entity.FloorsAboveGround), roundedHeight, int.Parse(entity.NumberOfResidentialUnits), peopleLivingInStructure, constructionYearOption);
    }

    public override Structure BuildEntity(DynamicsStructure dynamicsEntity)
    {
        throw new NotImplementedException();
    }

    private PeopleLivingInStructure GetPeopleLivingInStructure(string peopleLivingInStructure)
    {
        switch (peopleLivingInStructure)
        {
            case "yes": return PeopleLivingInStructure.Yes;
            case "no_block_ready":
            case "no_section_ready": return PeopleLivingInStructure.NoBlockReady;
            case "no_wont_move": return PeopleLivingInStructure.NoWontMove;
        }

        throw new ArgumentException();
    }

    private ConstructionYearOption GetConstructionYearOption(string constructionYearOption)
    {
        switch (constructionYearOption)
        {
            case "year-exact": return ConstructionYearOption.Exact;
            case "year-not-exact": return ConstructionYearOption.YearRange;
            case "not-completed": return ConstructionYearOption.NotBuilt;
        }

        throw new ArgumentException();
    }
}
