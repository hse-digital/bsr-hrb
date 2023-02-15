using HSEPortal.API.Model;

namespace HSEPortal.TestingCommon.Builders;

public class BuildingApplicationModelBuilder
{
    private string modelId = "HBR000000000";
    private string modelBuildingName = "building name";
    private string modelContactFirstName = "first name";
    private string modelContactLastName = "last name";
    private string modelContactPhoneNumber = "+44 808 157 0192";
    private string modelContactEmailAddress = "email address";

    public BuildingApplicationModelBuilder WithApplicationId(string applicationId)
    {
        modelId = applicationId;
        return this;
    }
    
    public BuildingApplicationModelBuilder WithBuildingName(string buildingName)
    {
        modelBuildingName = buildingName;
        return this;
    }

    public BuildingApplicationModelBuilder WithContactFirstName(string contactFirstName)
    {
        modelContactFirstName = contactFirstName;
        return this;
    }

    public BuildingApplicationModelBuilder WithContactLastName(string contactLastName)
    {
        modelContactLastName = contactLastName;
        return this;
    }

    public BuildingApplicationModelBuilder WithContactPhoneNumber(string contactPhoneNumber)
    {
        modelContactPhoneNumber = contactPhoneNumber;
        return this;
    }

    public BuildingApplicationModelBuilder WithContactEmailAddress(string contactEmailAddress)
    {
        modelContactEmailAddress = contactEmailAddress;
        return this;
    }

    public BuildingApplicationModel Build()
    {
        return new BuildingApplicationModel(modelId, modelBuildingName, modelContactFirstName, modelContactLastName, modelContactPhoneNumber, modelContactEmailAddress);
    }
}