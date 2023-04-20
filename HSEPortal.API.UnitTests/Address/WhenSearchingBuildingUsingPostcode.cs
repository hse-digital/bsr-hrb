using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.Address;

public class WhenSearchingBuildingUsingPostcode : UnitTestBase
{
    private AddressFunctions addressFunctions;
    private IntegrationsOptions integrationsOptions;
    private const string buckinghamPalacePostcode = "SW1A1AA";

    protected override void AdditionalSetup()
    {
        integrationsOptions = new IntegrationsOptions { OrdnanceSurveyEndpoint = "https://api.os.uk/search/places/v1", OrdnanceSurveyApiKey = "abc123" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Test]
    public async Task ShouldCallPostcodeEndpoint()
    {
        HttpTest.RespondWithJson(BuildPostcodeResponseJson());

        await addressFunctions.SearchBuildingByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.OrdnanceSurveyEndpoint}/postcode")
            .WithQueryParams(new
            {
                postcode = buckinghamPalacePostcode,
                dataset = "LPI",
                fq = "CLASSIFICATION_CODE:PP",
                key = integrationsOptions.OrdnanceSurveyApiKey
            })
            .WithVerb(HttpMethod.Get);
    }

    [Test]
    public async Task ShouldReturnMatchingAddresses()
    {
        var postcodeResponse = BuildPostcodeResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchBuildingByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(2);

        responseAddress.Results[0].UPRN.Should().Be(postcodeResponse.results[0].LPI.UPRN);
        responseAddress.Results[0].USRN.Should().Be(postcodeResponse.results[0].LPI.USRN);
        responseAddress.Results[0].Address.Should().Be(postcodeResponse.results[0].LPI.ADDRESS);
        responseAddress.Results[0].Number.Should().Be(postcodeResponse.results[0].LPI.PAO_START_NUMBER);
        responseAddress.Results[0].BuildingName.Should().Be(postcodeResponse.results[0].LPI.PAO_TEXT);
        responseAddress.Results[0].Street.Should().Be(postcodeResponse.results[0].LPI.STREET_DESCRIPTION);
        responseAddress.Results[0].Town.Should().Be(postcodeResponse.results[0].LPI.TOWN_NAME);
        responseAddress.Results[0].Country.Should().Be(postcodeResponse.results[0].LPI.COUNTRY_CODE);
        responseAddress.Results[0].AdministrativeArea.Should().Be(postcodeResponse.results[0].LPI.ADMINISTRATIVE_AREA);
        responseAddress.Results[0].Postcode.Should().Be(postcodeResponse.results[0].LPI.POSTCODE_LOCATOR);
    }

    [Test]
    public async Task ShouldReturnEmptyResultsIfPostcodeIsNotFound()
    {
        HttpTest.RespondWith(status: (int)HttpStatusCode.BadRequest);

        var response = await addressFunctions.SearchBuildingByPostcode(BuildHttpRequestData<object>(default, "invalid"), "invalid");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();
        responseAddress.MaxResults.Should().Be(0);
        responseAddress.Offset.Should().Be(0);
        responseAddress.TotalResults.Should().Be(0);
        responseAddress.Results.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldFilterResultsThatAreNotEnglandOrWales()
    {
        var postcodeResponse = BuildPostcodeResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchBuildingByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(2);

        responseAddress.Results.Any(x => x.Country is not ("E" or "W")).Should().BeFalse();
    }

    private OrdnanceSurveyPostcodeResponse BuildPostcodeResponseJson()
    {
        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                offset = 0,
                totalresults = 3,
                maxresults = 100,
            },
            results = new List<Result>
            {
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "10033544614",
                        ADDRESS = "BUCKINGHAM PALACE, THE MALL, LONDON, CITY OF WESTMINSTER, SW1A 1AA",
                        USRN = "8401058",
                        LPI_KEY = "5990L 000016069",
                        PAO_TEXT = "BUCKINGHAM PALACE",
                        PAO_START_NUMBER = "123",
                        STREET_DESCRIPTION = "THE MALL",
                        TOWN_NAME = "LONDON",
                        COUNTRY_CODE = "E",
                        ADMINISTRATIVE_AREA = "CITY OF WESTMINSTER",
                        POSTCODE_LOCATOR = "SW1A 1AA",
                        STATUS = "APPROVED",
                        LOGICAL_STATUS_CODE = "1",
                        CLASSIFICATION_CODE = "PP",
                        CLASSIFICATION_CODE_DESCRIPTION = "Property Shell",
                        LOCAL_CUSTODIAN_CODE = 5990,
                        LOCAL_CUSTODIAN_CODE_DESCRIPTION = "CITY OF WESTMINSTER",
                        MATCH = 1.0,
                    }
                },
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "123123",
                        COUNTRY_CODE = "W",
                    }
                },
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "66666",
                        COUNTRY_CODE = "X",
                    }
                }
            }
        };
    }
}