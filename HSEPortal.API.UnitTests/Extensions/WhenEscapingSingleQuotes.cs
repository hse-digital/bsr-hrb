using FluentAssertions;
using HSEPortal.API.Extensions;
using Xunit;

namespace HSEPortal.API.UnitTests.Extensions;

public class WhenEscapingSingleQuotes
{
    [Theory]
    [InlineData("James's", "James''s")]
    [InlineData("", "")]
    [InlineData(null, null)]
    public void ShouldAddSecondQuote(string value, string expected)
    {
        value.EscapeSingleQuote().Should().Be(expected);
    }
}