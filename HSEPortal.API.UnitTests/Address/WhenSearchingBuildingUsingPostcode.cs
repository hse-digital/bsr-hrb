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

public class WhenSearchingBuildingUsingPostcode : UnitTestBase
{
    private readonly AddressFunctions addressFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string buckinghamPalacePostcode = "SW1A1AA";

    public WhenSearchingBuildingUsingPostcode()
    {
        integrationsOptions = new IntegrationsOptions { CommonAPIEndpoint = "http://localhost:7126" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldCallPostcodeEndpoint()
    {
        HttpTest.RespondWithJson(BuildPostcodeResponseJson());

        await addressFunctions.SearchBuildingByPostcode(BuildHttpRequestData<object>(default, buckinghamPalacePostcode), buckinghamPalacePostcode);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.CommonAPIEndpoint}/api/SearchBuildingByPostcode/{buckinghamPalacePostcode}")
                .WithVerb(HttpMethod.Get);
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
                        UPRN = "66666",
                        COUNTRY_CODE = "X",
                    }
                }
            }
        };
    }
}