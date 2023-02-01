using Flurl.Http;
using Flurl.Http.Testing;
using HSEPortal.API.Dynamics;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace HSEPortal.API.UnitTests;

[TestFixture]
public abstract class UnitTestBase
{
    protected readonly string DynamicsEnvironmentUrl = "http://dynamics.api/v9.2";
    protected HttpTest HttpTest { get; private set; } = null!;
    protected DynamicsService DynamicsService { get; private set; } = null!;

    [SetUp]
    public void Setup()
    {
        FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

        var configuration = new Mock<IConfiguration>();
        configuration.SetupGet(x => x[DynamicsService.EnvironmentUrlSettingName]).Returns(DynamicsEnvironmentUrl);

        HttpTest = new HttpTest();
        DynamicsService = new DynamicsService(new DynamicsModelDefinitionFactory(), configuration.Object);
        AdditionalSetup();
    }

    protected virtual void AdditionalSetup()
    {
    }

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
}