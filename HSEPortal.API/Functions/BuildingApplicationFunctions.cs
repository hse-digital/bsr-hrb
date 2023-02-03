using System.Text.Json;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class BuildingApplicationFunctions
{
    private readonly DynamicsService dynamicsService;
    private readonly IOptions<DynamicsOptions> dynamicsOptions;

    public BuildingApplicationFunctions(DynamicsService dynamicsService, IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsService = dynamicsService;
        this.dynamicsOptions = dynamicsOptions;
    }

    [Function(nameof(NewBuildingApplication))]
    public async Task<HttpResponseData> NewBuildingApplication([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var response = request.CreateResponse();
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, dynamicsOptions.Value);
        
        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        response.Body = stream;
        return response;
        
        var buildingRegistrationModel = await request.ReadAsJsonAsync<BuildingRegistrationModel>();
        var validation = buildingRegistrationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        await dynamicsService.RegisterNewBuildingApplicationAsync(buildingRegistrationModel);
        return request.CreateResponse();
    }
}