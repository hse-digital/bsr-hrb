using System.Text.Json;
using AutoMapper;
using Flurl.Http;
using Flurl.Http.Testing;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Services;
using HSEPortal.API.UnitTests.Helpers;
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

    protected OTPService OtpService { get; }
    protected IOptions<FeatureOptions> FeatureOptions = new OptionsWrapper<FeatureOptions>(new FeatureOptions());

    protected UnitTestBase()
    {
        FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

        var options = new Mock<IOptions<DynamicsOptions>>();
        options.SetupGet(x => x.Value).Returns(DynamicsOptions);

        HttpTest = new HttpTest();
        DynamicsService = new DynamicsService(new DynamicsModelDefinitionFactory(), options.Object);
        OtpService = new OTPService();
    }

    protected readonly DynamicsOptions DynamicsOptions = new()
    {
        EnvironmentUrl = "http://dynamics.api",
        TenantId = "1AEA2273-3130-4432-ABB5-9E45BED87E26",
        ClientId = "77C07F1C-2FB1-4C9F-9C99-82C468AF8299",
        ClientSecret = "BA8787F6-C52B-49F8-B1D1-F9E54754EEF7",
        EmailVerificationFlowUrl = "http://flow_url"
    };

    protected HttpRequestData BuildHttpRequestData<T>(T data, params string[] parameters)
    {
        var functionContext = new Mock<FunctionContext>();

        var memoryStream = new MemoryStream();
        JsonSerializer.Serialize(memoryStream, data);

        memoryStream.Flush();
        memoryStream.Seek(0, SeekOrigin.Begin);

        return new TestableHttpRequestData(functionContext.Object, new Uri(DynamicsOptions.EnvironmentUrl), memoryStream);
    }

    protected object BuildODataEntityHeader(string id)
    {
        return $"OData-EntityId={DynamicsOptions.EnvironmentUrl}/api/data/v9.2/whatever_entity({id})";
    }

    protected IMapper GetMapper()
    {
        return new MapperConfiguration(config =>
        {
            config.AddProfile<OrdnanceSurveyPostcodeResponseProfile>();
            config.AddProfile<CompaniesHouseSearchResponseProfile>();
        }).CreateMapper();
    }
}