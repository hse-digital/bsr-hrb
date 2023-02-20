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
    public async Task<HttpResponseData> SearchBuildingByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SearchBuildingByPostcode/{postcode}")] HttpRequestData request, string postcode)
    {
        var response = await integrationOptions.OrdnanceSurveyEndpoint
            .AppendPathSegment("postcode")
            .SetQueryParams(new
            {
                postcode = postcode,
                dataset = "LPI",
                fq = "CLASSIFICATION_CODE:PP",
                key = integrationOptions.OrdnanceSurveyApiKey
            })
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetAsync();

        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var postcodeResponse = await response.GetJsonAsync<OrdnanceSurveyPostcodeResponse>();
        var searchResponse = mapper.Map<BuildingAddressSearchResponse>(postcodeResponse);
        return await request.CreateObjectResponseAsync(searchResponse);
    }
}