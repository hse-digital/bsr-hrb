using System.Net;
using FluentAssertions;
using Flurl;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.Address;

public class WhenSearchingAddress : UnitTestBase
{
    private readonly AddressFunctions addressFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string searchQuery = "10, BRESSENDEN PLACE";

    public WhenSearchingAddress()
    {
        integrationsOptions = new IntegrationsOptions { OrdnanceSurveyEndpoint = "https://api.os.uk/search/places/v1", OrdnanceSurveyApiKey = "abc123" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldCallQueryEndpoint()
    {
        HttpTest.RespondWithJson(BuildAddressResponseJson());
        await addressFunctions.SearchAddress(BuildHttpRequestData<object>(default, searchQuery), searchQuery);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.OrdnanceSurveyEndpoint}/find?query={Url.Encode(searchQuery)}&dataset={Url.Encode("LPI,DPA")}&minmatch=0.5&key={integrationsOptions.OrdnanceSurveyApiKey}")
            .WithVerb(HttpMethod.Get);
    }

    [Fact]
    public async Task ShouldReturnMatchingAddresses()
    {
        var postcodeResponse = BuildAddressResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchAddress(BuildHttpRequestData<object>(default, searchQuery), searchQuery);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(postcodeResponse.header.totalresults);

        responseAddress.Results[0].UPRN.Should().Be(postcodeResponse.results[0].LPI.UPRN);
        responseAddress.Results[0].USRN.Should().Be(postcodeResponse.results[0].LPI.USRN);
        responseAddress.Results[0].Address.Should().Be(postcodeResponse.results[0].LPI.ADDRESS);
        responseAddress.Results[0].BuildingName.Should().Be(postcodeResponse.results[0].LPI.PAO_TEXT);
        responseAddress.Results[0].Street.Should().Be(postcodeResponse.results[0].LPI.STREET_DESCRIPTION);
        responseAddress.Results[0].Town.Should().Be(postcodeResponse.results[0].LPI.TOWN_NAME);
        responseAddress.Results[0].AdministrativeArea.Should().Be(postcodeResponse.results[0].LPI.ADMINISTRATIVE_AREA);
        responseAddress.Results[0].Postcode.Should().Be(postcodeResponse.results[0].LPI.POSTCODE_LOCATOR);
    }

    [Fact]
    public async Task ShouldReturnEmptyResultListIfAddressIsNotFound()
    {
        HttpTest.RespondWithJson(BuildEmptyResultResponseJson());
        var response = await addressFunctions.SearchAddress(BuildHttpRequestData<object>(default, searchQuery), searchQuery);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.Results.Should().BeEmpty();
    }

    private OrdnanceSurveyPostcodeResponse BuildEmptyResultResponseJson()
    {
        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                offset = 0,
                totalresults = 8000,
                maxresults = 100,
            }
        };
    }

    private OrdnanceSurveyPostcodeResponse BuildAddressResponseJson()
    {
        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                offset = 0,
                totalresults = 1,
                maxresults = 100,
            },
            results = new List<Result>
            {
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "10033638118",
                        ADDRESS = "10, BRESSENDEN PLACE, LONDON, CITY OF WESTMINSTER, SW1E 5DN",
                        USRN = "8401131",
                        LPI_KEY = "5990L000239691",
                        STREET_DESCRIPTION = "BRESSENDEN PLACE",
                        TOWN_NAME = "LONDON",
                        ADMINISTRATIVE_AREA = "CITY OF WESTMINSTER",
                        POSTCODE_LOCATOR = "SW1E 5DN",
                        RPC = "1",
                        X_COORDINATE = 529026.27,
                        Y_COORDINATE = 179324.61,
                        STATUS = "APPROVED",
                        LOGICAL_STATUS_CODE = "1",
                        CLASSIFICATION_CODE = "PP",
                        CLASSIFICATION_CODE_DESCRIPTION = "Property Shell",
                        LOCAL_CUSTODIAN_CODE = 5990,
                        LOCAL_CUSTODIAN_CODE_DESCRIPTION = "CITY OF WESTMINSTER",
                        COUNTRY_CODE = "E",
                        COUNTRY_CODE_DESCRIPTION = "This record is within England",
                        POSTAL_ADDRESS_CODE = "D",
                        POSTAL_ADDRESS_CODE_DESCRIPTION = "A record which is linked to PAF",
                        BLPU_STATE_CODE = "2",
                        BLPU_STATE_CODE_DESCRIPTION = "In use",
                        TOPOGRAPHY_LAYER_TOID = "osgb1000042217690",
                        LAST_UPDATE_DATE = "10/01/2023",
                        ENTRY_DATE = "21/06/2017",
                        BLPU_STATE_DATE = "21/06/2017",
                        LPI_LOGICAL_STATUS_CODE = "1",
                        LPI_LOGICAL_STATUS_CODE_DESCRIPTION = "APPROVED",
                        LANGUAGE = "EN",
                        MATCH = 0.5,
                        MATCH_DESCRIPTION = "NO MATCH"
                    }
                }
            }
        };
    }
}