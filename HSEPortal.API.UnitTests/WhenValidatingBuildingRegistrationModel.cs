using FluentAssertions;
using HSEPortal.API.Model;
using HSEPortal.API.UnitTests.Builders;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenValidatingBuildingRegistrationModel
{
    [Fact]
    public void ShouldReturnNoErrorsWhenModelIsValid()
    {
        var model = new BuildingRegistrationModelBuilder().Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeTrue();
        validationResult.Errors.Should().BeEmpty();
    }

    [Theory]
    [MemberData(nameof(ValidationTestCases))]
    public void ShouldValidateBuildingRegistrationFields(BuildingRegistrationModel model, string errorMessage)
    {
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain(errorMessage);
    }

    [Fact]
    public void ShouldReturnMultipleErrorMessagesWhenMultipleFieldsAreInvalid()
    {
        var model = new BuildingRegistrationModelBuilder().WithBuildingName(null).WithContactFirstName(null)
            .WithContactLastName(null).WithContactPhoneNumber(null).WithContactEmailAddress(null).Build();
        var validationResult = model.Validate();
        
        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain("Building name is required");
        validationResult.Errors.Should().Contain("Contact first name is required");
        validationResult.Errors.Should().Contain("Contact last name is required");
        validationResult.Errors.Should().Contain("Contact phone number is required");
        validationResult.Errors.Should().Contain("Contact email address is required");
    }

    [Theory]
    [InlineData("07700900982", true)]
    [InlineData("07700 900 982", true)]
    [InlineData("+448081570192", true)]
    [InlineData("+44 808 157 0192", true)]
    [InlineData("01632960001", true)]
    [InlineData("01632 960 001", true)]
    [InlineData("+55123123", false)]
    [InlineData("+0124123123", false)]
    [InlineData("+44 808 157 0192 33", false)]
    public void ShouldValidatePhoneNumberFormat(string phoneNumber, bool isValid)
    {
        var model = new BuildingRegistrationModelBuilder().WithContactPhoneNumber(phoneNumber).Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().Be(isValid);
        if (!isValid)
        {
            validationResult.Errors.Should().Contain("You must enter a UK telephone number. For example, 01632 960 001, 07700 900 982 or +44 808 157 0192");
        }
    }

    public static IEnumerable<object?[]> ValidationTestCases()
    {
        // building name
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithBuildingName("").Build(), "Building name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithBuildingName(" ").Build(), "Building name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithBuildingName(default).Build(), "Building name is required" };
        
        // first name
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactFirstName("").Build(), "Contact first name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactFirstName(" ").Build(), "Contact first name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactFirstName(default).Build(), "Contact first name is required" };
        
        // last name
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactLastName("").Build(), "Contact last name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactLastName(" ").Build(), "Contact last name is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactLastName(default).Build(), "Contact last name is required" };
        
        // phone number
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactPhoneNumber("").Build(), "Contact phone number is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactPhoneNumber(" ").Build(), "Contact phone number is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactPhoneNumber(default).Build(), "Contact phone number is required" };
        
        // email address
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactEmailAddress("").Build(), "Contact email address is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactEmailAddress(" ").Build(), "Contact email address is required" };
        yield return new object?[] { new BuildingRegistrationModelBuilder().WithContactEmailAddress(default).Build(), "Contact email address is required" };
    }
}