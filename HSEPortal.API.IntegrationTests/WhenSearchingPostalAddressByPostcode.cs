using System.Net;
using FluentAssertions;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.IntegrationTests;

public class SearchPostalAddressByPostcode : IntegrationTestBase
{
    private readonly IOptions<SwaOptions> swaOptions;

    public SearchPostalAddressByPostcode(IOptions<SwaOptions> swaOptions)
    {
        this.swaOptions = swaOptions;
    }

    
    public static IEnumerable<object[]> getPostcode() {
        object[] postcodes = new object[] { "SW1A1A", "BA1 1EL", "SW1X7LJ", "SW10 0UN", "SW1W 8BJ", "SW5 0DE"};
        foreach(object element in postcodes) {
            yield return new object[] {element};
        }
    }

    [Theory]
    [MemberData(nameof(getPostcode))]    
    public async Task ShouldReturnAddressessUsingValidPostcodes(string postcode)
    {
        var response = await swaOptions.Value.Url
            .AppendPathSegments("api", "SearchPostalAddressByPostcode", postcode)
            .AllowAnyHttpStatus().GetAsync();

        response.StatusCode.Should().Be((int)HttpStatusCode.OK);

        BuildingAddressSearchResponse addressResponse = await response.GetJsonAsync<BuildingAddressSearchResponse>();
        addressResponse.TotalResults.Should().BeGreaterThan(0);
        addressResponse.MaxResults.Should().BeGreaterThan(0);
        addressResponse.Results.Length.Should().BeGreaterThan(0);
    }

    [Theory]
    [MemberData(nameof(getPostcode))]
    public async Task ShouldReturnClassificationCodesPPorP(string postcode)
    {
        var response = await swaOptions.Value.Url
            .AppendPathSegments("api", "SearchPostalAddressByPostcode", postcode)
            .AllowAnyHttpStatus()
            .GetJsonAsync<BuildingAddressSearchResponse>();

        response.Results.All(x => x.ClassificationCode.Equals("P") || x.ClassificationCode.Equals("PP"));
    }
}