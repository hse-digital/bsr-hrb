using System.Net;
using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class AddressFunctions
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationOptions;

    public AddressFunctions(IOptions<IntegrationsOptions> integrationOptions, IMapper mapper)
    {
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
    }

    [Function(nameof(SearchBuildingByPostcode))]
    public async Task<HttpResponseData> SearchBuildingByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchBuildingByPostcode)}/{{postcode}}")] HttpRequestData request, string postcode)
    {
        var response = await GetDataFromOrdnanceSurvey("postcode", new
        {
            postcode = postcode,
            dataset = "LPI",
            fq = new[] { "CLASSIFICATION_CODE:PP", "COUNTRY_CODE:E" },
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObjectAsync(request, response);
    }

    [Function(nameof(SearchPostalAddressByPostcode))]
    public async Task<HttpResponseData> SearchPostalAddressByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchPostalAddressByPostcode)}/{{postcode}}")] HttpRequestData request, string postcode)
    {
        var response = await GetDataFromOrdnanceSurvey("postcode", new
        {
            postcode = postcode,
            dataset = "DPA",
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObjectAsync(request, response);
    }

    [Function(nameof(SearchAddress))]
    public async Task<HttpResponseData> SearchAddress([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchAddress)}/{{query}}")] HttpRequestData request, string query)
    {
        var response = await GetDataFromOrdnanceSurvey("find", new
        {
            query = query,
            dataset = "LPI,DPA",
            minmatch = 0.5,
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObjectAsync(request, response);
    }

    private async Task<HttpResponseData> BuildResponseObjectAsync(HttpRequestData request, IFlurlResponse response)
    {
        var searchResponse = await GetSearchResponseAsync(response);
        return await request.CreateObjectResponseAsync(searchResponse);
    }

    private async Task<BuildingAddressSearchResponse> GetSearchResponseAsync(IFlurlResponse response)
    {
        BuildingAddressSearchResponse searchResponse;
        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
        {
            searchResponse = new BuildingAddressSearchResponse { Results = Array.Empty<BuildingAddress>() };
        }
        else
        {
            var postcodeResponse = await response.GetJsonAsync<OrdnanceSurveyPostcodeResponse>();
            var englandAndWalesResponse = GetEnglandOrWalesResponses(postcodeResponse);
            searchResponse = mapper.Map<BuildingAddressSearchResponse>(englandAndWalesResponse);
        }

        return searchResponse;
    }

    private Task<IFlurlResponse> GetDataFromOrdnanceSurvey(string endpoint, object queryParams)
    {
        var allowHttpStatus = integrationOptions.OrdnanceSurveyEndpoint
            .AppendPathSegment(endpoint)
            .SetQueryParams(queryParams)
            .AllowHttpStatus(HttpStatusCode.BadRequest);
        return allowHttpStatus
            .GetAsync();
    }

    private OrdnanceSurveyPostcodeResponse GetEnglandOrWalesResponses(OrdnanceSurveyPostcodeResponse postcodeResponse)
    {
        var eOrW = postcodeResponse.results.Where(x => x.LPI?.COUNTRY_CODE is "E" or "W" || x.DPA?.COUNTRY_CODE is "E" or "W").ToList();

        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                maxresults = postcodeResponse.header.maxresults,
                offset = postcodeResponse.header.offset,
                totalresults = eOrW.Count
            },
            results = eOrW
        };
    }
}