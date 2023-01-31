namespace HSEPortal.API.Models;

public class BuildingDetails
{
    public string BuildingName { get; set; }
    public int FloorsAbove { get; set; }
    public double Height { get; set; }
    public PeopleLivingInBuilding? PeopleLivingInBuilding { get; set; }
    public int ResidentialUnits { get; set; }
}

public enum PeopleLivingInBuilding
{
    Yes = 760810000,
    NoReadyToMove = 760810001,
    NoPeopleWontMove = 760810002
}