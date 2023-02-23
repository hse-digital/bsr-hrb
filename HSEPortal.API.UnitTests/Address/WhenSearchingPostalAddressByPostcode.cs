using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.Address;

public class WhenSearchingPostalAddressByPostcode : UnitTestBase
{
    private readonly AddressFunctions addressFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string buckinghamPalacePostcode = "SW1A1AA";

    public WhenSearchingPostalAddressByPostcode()
    {
        integrationsOptions = new IntegrationsOptions { OrdnanceSurveyEndpoint = "https://api.os.uk/search/places/v1", OrdnanceSurveyApiKey = "abc123" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldCallPostcodeEndpoint()
    {
        HttpTest.RespondWithJson(BuildPostcodeResponseJson());

        await addressFunctions.SearchPostalAddressByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.OrdnanceSurveyEndpoint}/postcode")
            .WithQueryParams(new
            {
                postcode = buckinghamPalacePostcode,
                dataset = "DPA",
                fq = "COUNTRY_CODE=E&fq=COUNTRY_CODE=W",
                key = integrationsOptions.OrdnanceSurveyApiKey
            })
            .WithVerb(HttpMethod.Get);
    }

    [Fact]
    public async Task ShouldReturnMatchingAddresses()
    {
        var postcodeResponse = BuildPostcodeResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchPostalAddressByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(postcodeResponse.header.totalresults);

        responseAddress.Results[0].UPRN.Should().Be(postcodeResponse.results[0].DPA.UPRN);
        responseAddress.Results[0].Address.Should().Be(postcodeResponse.results[0].DPA.ADDRESS);
        responseAddress.Results[0].BuildingName.Should().Be(postcodeResponse.results[0].DPA.SUB_BUILDING_NAME);
        responseAddress.Results[0].Street.Should().Be(postcodeResponse.results[0].DPA.THOROUGHFARE_NAME);
        responseAddress.Results[0].Town.Should().Be(postcodeResponse.results[0].DPA.POST_TOWN);
        responseAddress.Results[0].Postcode.Should().Be(postcodeResponse.results[0].DPA.POSTCODE);
    }

    [Fact]
    public async Task ShouldReturnEmptyResultsIfPostcodeIsNotFound()
    {
        HttpTest.RespondWith(status: (int)HttpStatusCode.BadRequest);

        var response = await addressFunctions.SearchPostalAddressByPostcode(BuildHttpRequestData<object>(default, "invalid"), "invalid");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();
        responseAddress.MaxResults.Should().Be(0);
        responseAddress.Offset.Should().Be(0);
        responseAddress.TotalResults.Should().Be(0);
        responseAddress.Results.Should().BeEmpty();
    }

    private OrdnanceSurveyPostcodeResponse BuildPostcodeResponseJson()
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
                    DPA = new DPA
                    {
                        UPRN = "100021210108",
                        UDPRN = "15751415",
                        ADDRESS = "FLAT 1, 1, PALACE GATES ROAD, LONDON, N22 7BW",
                        SUB_BUILDING_NAME = "FLAT 1",
                        BUILDING_NUMBER = "1",
                        THOROUGHFARE_NAME = "PALACE GATES ROAD",
                        POST_TOWN = "LONDON",
                        POSTCODE = "N22 7BW",
                        RPC = "1",
                        X_COORDINATE = 530166.0,
                        Y_COORDINATE = 190531.0,
                        STATUS = "APPROVED",
                        LOGICAL_STATUS_CODE = "1",
                        CLASSIFICATION_CODE = "RD06",
                        CLASSIFICATION_CODE_DESCRIPTION = "Self Contained Flat (Includes Maisonette / Apartment)",
                        LOCAL_CUSTODIAN_CODE = 5420,
                        LOCAL_CUSTODIAN_CODE_DESCRIPTION = "LONDON BOROUGH OF HARINGEY",
                        COUNTRY_CODE = "E",
                        COUNTRY_CODE_DESCRIPTION = "This record is within England",
                        POSTAL_ADDRESS_CODE = "D",
                        POSTAL_ADDRESS_CODE_DESCRIPTION = "A record which is linked to PAF",
                        BLPU_STATE_CODE = "2",
                        BLPU_STATE_CODE_DESCRIPTION = "In use",
                        TOPOGRAPHY_LAYER_TOID = "osgb1000005604612",
                        PARENT_UPRN = "100023658485",
                        LAST_UPDATE_DATE = "16/05/2022",
                        ENTRY_DATE = "31/03/2004",
                        BLPU_STATE_DATE = "24/03/2004",
                        LANGUAGE = "EN",
                        MATCH = 1.0,
                        MATCH_DESCRIPTION = "EXACT",
                        DELIVERY_POINT_SUFFIX = "3Q"
                    }
                }
            }
        };
    }
}