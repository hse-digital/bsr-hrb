using System.Security.Claims;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.UnitTests.Helpers;

public class TestableHttpRequestData : HttpRequestData
{
    public TestableHttpRequestData(FunctionContext functionContext, Uri url, Stream body = null) : base(functionContext)
    {
        Url = url;
        Body = body ?? new MemoryStream();
    }

    public override Stream Body { get; } = new MemoryStream();

    public override HttpHeadersCollection Headers { get; } = new();

    public override IReadOnlyCollection<IHttpCookie> Cookies { get; }

    public override Uri Url { get; }

    public override IEnumerable<ClaimsIdentity> Identities { get; }

    public override string Method { get; }

    public override HttpResponseData CreateResponse()
    {
        return new TestableHttpResponseData(FunctionContext);
    }
}