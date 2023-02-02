using HSEPortal.API.Model;

namespace HSEPortal.TestingComming.Builders;

public class BuildingRegistrationModelBuilder
{
    private string modelBuildingName = "building name";
    private string modelContactFirstName = "first name";
    private string modelContactLastName = "last name";
    private string modelContactPhoneNumber = "+44 808 157 0192";
    private string modelContactEmailAddress = "email address";

    public BuildingRegistrationModelBuilder WithBuildingName(string buildingName)
    {
        modelBuildingName = buildingName;
        return this;
    }

    public BuildingRegistrationModelBuilder WithContactFirstName(string contactFirstName)
    {
        modelContactFirstName = contactFirstName;
        return this;
    }

    public BuildingRegistrationModelBuilder WithContactLastName(string contactLastName)
    {
        modelContactLastName = contactLastName;
        return this;
    }

    public BuildingRegistrationModelBuilder WithContactPhoneNumber(string contactPhoneNumber)
    {
        modelContactPhoneNumber = contactPhoneNumber;
        return this;
    }

    public BuildingRegistrationModelBuilder WithContactEmailAddress(string contactEmailAddress)
    {
        modelContactEmailAddress = contactEmailAddress;
        return this;
    }

    public BuildingRegistrationModel Build()
    {
        return new BuildingRegistrationModel(modelBuildingName, modelContactFirstName, modelContactLastName, modelContactPhoneNumber, modelContactEmailAddress);
    }
}