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
            fq = "CLASSIFICATION_CODE:PP",
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObject(request, response);
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

        return await BuildResponseObject(request, response);
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

        return await BuildResponseObject(request, response);
    }

    private async Task<HttpResponseData> BuildResponseObject(HttpRequestData request, IFlurlResponse response)
    {
        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var postcodeResponse = await response.GetJsonAsync<OrdnanceSurveyPostcodeResponse>();
        var searchResponse = mapper.Map<BuildingAddressSearchResponse>(postcodeResponse);
        return await request.CreateObjectResponseAsync(searchResponse);
    }

    private Task<IFlurlResponse> GetDataFromOrdnanceSurvey(string endpoint, object queryParams)
    {
        return integrationOptions.OrdnanceSurveyEndpoint
            .AppendPathSegment(endpoint)
            .SetQueryParams(queryParams)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetAsync();
    }
}