using System.Text.Json;
using AutoMapper;
using Flurl;
using Flurl.Http;
using Flurl.Http.Testing;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Model.LocalAuthority;
using HSEPortal.API.Model.OrdnanceSurvey;
using HSEPortal.API.Model.Payment;
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
        DynamicsService = new DynamicsService(new DynamicsModelDefinitionFactory(), options.Object, new OptionsWrapper<SwaOptions>(new SwaOptions()), new OptionsWrapper<IntegrationsOptions>(IntegrationOptions), new DynamicsApi(options.Object));
        OtpService = new OTPService(new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
    }

    protected readonly DynamicsOptions DynamicsOptions = new()
    {
        EnvironmentUrl = "http://dynamics.api",
        TenantId = "1AEA2273-3130-4432-ABB5-9E45BED87E26",
        ClientId = "77C07F1C-2FB1-4C9F-9C99-82C468AF8299",
        ClientSecret = "BA8787F6-C52B-49F8-B1D1-F9E54754EEF7",
        EmailVerificationFlowUrl = "http://flow_url",
        LocalAuthorityTypeId = "db305f3e-1dad-ed11-83ff-0022481b5e4f"
    };

    protected readonly IntegrationsOptions IntegrationOptions = new() { CommonAPIEndpoint = "http://app.in.azure", CommonAPIKey = "abc123" };

    protected HttpRequestData BuildHttpRequestData<T>(T data, params string[] parameters)
    {
        return BuildHttpRequestDataWithUri(data, new Uri(DynamicsOptions.EnvironmentUrl));
    }

    protected HttpRequestData BuildHttpRequestData<T>(T data, Parameter[] parameters)
    {
        Uri uri = new Uri(DynamicsOptions.EnvironmentUrl).SetQueryParams(parameters.Select(p => new { key = p.Key, value = p.Value })).ToUri();
        return BuildHttpRequestDataWithUri(data, uri);
    }

    protected TestableHttpRequestData BuildHttpRequestDataWithUri<T>(T data, Uri uri)
    {
        var functionContext = new Mock<FunctionContext>();

        var memoryStream = new MemoryStream();
        JsonSerializer.Serialize(memoryStream, data);

        memoryStream.Flush();
        memoryStream.Seek(0, SeekOrigin.Begin);

        return new TestableHttpRequestData(functionContext.Object, uri, memoryStream);
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
            config.AddProfile<LocalAuthoritiesSearchResponseProfile>();
            config.AddProfile<PaymentProfile>();
        }).CreateMapper();
    }
}

public class Parameter
{
    public string Key { get; set; }
    public string Value { get; set; }
}