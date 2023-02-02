using System.Text.Json;
using Flurl.Http;
using Flurl.Http.Testing;
using HSEPortal.Domain.DynamicsDefinitions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using Moq;

namespace HSEPortal.API.UnitTests;

public abstract class UnitTestBase
{
    protected HttpTest HttpTest { get; }
    protected DynamicsService DynamicsService { get; }
    
    protected UnitTestBase()
    {
        FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

        var options = new Mock<IOptions<DynamicsOptions>>();
        options.SetupGet(x => x.Value).Returns(DynamicsOptions);

        HttpTest = new HttpTest();
        DynamicsService = new DynamicsService(new DynamicsModelDefinitionFactory(), options.Object);
    }

    protected readonly DynamicsOptions DynamicsOptions = new()
    {
        EnvironmentUrl = "http://dynamics.api",
        TenantId = "1AEA2273-3130-4432-ABB5-9E45BED87E26",
        ClientId = "77C07F1C-2FB1-4C9F-9C99-82C468AF8299",
        ClientSecret = "BA8787F6-C52B-49F8-B1D1-F9E54754EEF7"
    };

    protected HttpRequestData BuildHttpRequestData<T>(T data)
    {
        var functionContext = new Mock<FunctionContext>();
        var requestData = new Mock<HttpRequestData>(functionContext.Object);

        var memoryStream = new MemoryStream();
        JsonSerializer.Serialize(memoryStream, data);

        memoryStream.Flush();
        memoryStream.Seek(0, SeekOrigin.Begin);

        requestData.SetupGet(x => x.Body).Returns(memoryStream);

        return requestData.Object;
    }

    protected object BuildODataEntityHeader(string id)
    {
        return $"OData-EntityId={DynamicsOptions.EnvironmentUrl}/api/data/v9.2/whatever_entity({id})";
    }
}