using System.Text.Json;
using Flurl.Http.Testing;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

[TestFixture]
public abstract class UnitTestBase
{
    protected HttpTest HttpTest { get; private set; } = null!;
    protected DynamicsService DynamicsService { get; private set; } = null!;

    [SetUp]
    public void Setup()
    {
        HttpTest = new HttpTest();
        DynamicsService = new DynamicsService();
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