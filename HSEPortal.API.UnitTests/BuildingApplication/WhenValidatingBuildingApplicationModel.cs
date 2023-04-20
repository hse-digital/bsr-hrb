using FluentAssertions;
using HSEPortal.API.Model;
using HSEPortal.TestingCommon.Builders;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenValidatingBuildingRegistrationModel
{
    [Test]
    public void ShouldReturnNoErrorsWhenModelIsValid()
    {
        var model = new BuildingApplicationModelBuilder().Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeTrue();
        validationResult.Errors.Should().BeEmpty();
    }

    [TestCaseSource(nameof(ValidationTestCases))]
    public void ShouldValidateBuildingRegistrationFields(BuildingApplicationModel model, string errorMessage)
    {
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain(errorMessage);
    }

    [Test]
    public void ShouldReturnMultipleErrorMessagesWhenMultipleFieldsAreInvalid()
    {
        var model = new BuildingApplicationModelBuilder().WithBuildingName(null).WithContactFirstName(null)
            .WithContactLastName(null).WithContactPhoneNumber(null).WithContactEmailAddress(null).Build();
        var validationResult = model.Validate();
        
        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain("Building name is required");
        validationResult.Errors.Should().Contain("Contact first name is required");
        validationResult.Errors.Should().Contain("Contact last name is required");
        validationResult.Errors.Should().Contain("Contact phone number is required");
        validationResult.Errors.Should().Contain("Contact email address is required");
    }

    [TestCase("07700900982", true)]
    [TestCase("07700 900 982", true)]
    [TestCase("+448081570192", true)]
    [TestCase("+44 808 157 0192", true)]
    [TestCase("01632960001", true)]
    [TestCase("01632 960 001", true)]
    [TestCase("+55123123", false)]
    [TestCase("+0124123123", false)]
    [TestCase("+44 808 157 0192 33", false)]
    public void ShouldValidatePhoneNumberFormat(string phoneNumber, bool isValid)
    {
        var model = new BuildingApplicationModelBuilder().WithContactPhoneNumber(phoneNumber).Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().Be(isValid);
        if (!isValid)
        {
            validationResult.Errors.Should().Contain("You must enter a UK telephone number. For example, 01632 960 001, 07700 900 982 or +44 808 157 0192");
        }
    }

    public static IEnumerable<object[]> ValidationTestCases()
    {
        // building name
        yield return new object[] { new BuildingApplicationModelBuilder().WithBuildingName("").Build(), "Building name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithBuildingName(" ").Build(), "Building name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithBuildingName(default).Build(), "Building name is required" };
        
        // first name
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactFirstName("").Build(), "Contact first name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactFirstName(" ").Build(), "Contact first name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactFirstName(default).Build(), "Contact first name is required" };
        
        // last name
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactLastName("").Build(), "Contact last name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactLastName(" ").Build(), "Contact last name is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactLastName(default).Build(), "Contact last name is required" };
        
        // phone number
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactPhoneNumber("").Build(), "Contact phone number is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactPhoneNumber(" ").Build(), "Contact phone number is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactPhoneNumber(default).Build(), "Contact phone number is required" };
        
        // email address
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactEmailAddress("").Build(), "Contact email address is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactEmailAddress(" ").Build(), "Contact email address is required" };
        yield return new object[] { new BuildingApplicationModelBuilder().WithContactEmailAddress(default).Build(), "Contact email address is required" };
    }
}