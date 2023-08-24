using System.Globalization;
using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class StructureDefinition : DynamicsModelDefinition<Structure, DynamicsStructure>
{
    public override string Endpoint => "bsr_blocks";
    private DynamicsStructure dynamicsStructure;

    public override DynamicsStructure BuildDynamicsEntity(Structure entity)
    {
        
        this.dynamicsStructure = new DynamicsStructure
        {
            bsr_name = entity.Name,
            bsr_nooffloorsabovegroundlevel = int.Parse(entity.FloorsAboveGround),
            bsr_sectionheightinmetres = Math.Round(float.Parse(entity.HeightInMeters, CultureInfo.InvariantCulture), 2)
        };

        AddPeopleLivingInBuilding(entity);
        AddResidentialUnits(entity);
        AddExactConstructionYear(entity);

        return dynamicsStructure;
    }

    private void AddPeopleLivingInBuilding(Structure entity){
        if (entity.PeopleLivingInStructure != null) {
            var peopleLivingInStructure = GetPeopleLivingInStructure(entity.PeopleLivingInStructure);
            this.dynamicsStructure = dynamicsStructure with {bsr_arepeoplelivingintheblock = peopleLivingInStructure};
        }
    }

    private void AddResidentialUnits(Structure entity){
        if (entity.NumberOfResidentialUnits != null) {
            var numberOfResidentialUnits = int.Parse(entity.NumberOfResidentialUnits);
            this.dynamicsStructure = dynamicsStructure with {bsr_numberofresidentialunits = numberOfResidentialUnits};
        }
    }

    private void AddExactConstructionYear(Structure entity) {
        if (entity.ConstructionYearOption != null) {
            var constructionYearOption = GetConstructionYearOption(entity.ConstructionYearOption);
            this.dynamicsStructure = dynamicsStructure with {bsr_doyouknowtheblocksexactconstructionyear = constructionYearOption};
        }
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