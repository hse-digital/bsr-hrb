using FluentAssertions;
using HSEPortal.API.Extensions;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.Extensions;

public class WhenEscapingSingleQuotes
{
    [TestCase("James's", "James''s")]
    [TestCase("", "")]
    [TestCase(null, null)]
    public void ShouldAddSecondQuote(string value, string expected)
    {
        value.EscapeSingleQuote().Should().Be(expected);
    }
}