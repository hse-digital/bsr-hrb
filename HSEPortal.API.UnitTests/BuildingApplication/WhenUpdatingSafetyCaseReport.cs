using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace HSEPortal.API.UnitTests.BuildingApplication
{
    public class WhenUpdatingSafetyCaseReport : UnitTestBase
    {
        private readonly BuildingApplicationFunctions buildingApplicationFunctions;
        private readonly MockRepository _mockRepository;
        private readonly Mock<IDynamicsService> _dynamicServiceMock;

        public WhenUpdatingSafetyCaseReport()
        {
            _mockRepository = new MockRepository(MockBehavior.Default);
            _dynamicServiceMock = _mockRepository.Create<IDynamicsService>();

            buildingApplicationFunctions = new BuildingApplicationFunctions(_dynamicServiceMock.Object, OtpService, FeatureOptions, new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
        }

        [Fact]
        public async Task ShouldReturnOkWhenRequestIsValid()
        {
            var applicationNumber = "applicationNumber";
            var date = DateTime.Now;

            _dynamicServiceMock.Setup(x => x.UpdateSafetyCaseReportSubmissionDate(applicationNumber, date)).Returns(Task.CompletedTask);

            var response = await buildingApplicationFunctions.UpdateSafetyCaseDeclaration(BuildHttpRequestData(new SafetyCaseReportRequestModel { ApplicationNumber = applicationNumber, Date = date }));
            
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _dynamicServiceMock.Verify(x => x.UpdateSafetyCaseReportSubmissionDate(applicationNumber, date), Times.Once);
        }

        [Fact]
        public async Task ShouldReturnBadRequestIfRequestIsInvalid()
        {
            var applicationNumber = default(string);
            var date = default(DateTime);

            var response = await buildingApplicationFunctions.UpdateSafetyCaseDeclaration(BuildHttpRequestData(new SafetyCaseReportRequestModel { ApplicationNumber = applicationNumber, Date = date }));

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _dynamicServiceMock.Verify(x => x.UpdateSafetyCaseReportSubmissionDate(applicationNumber, date), Times.Never);
        }

        [Fact]
        public async Task ShouldReturnBadRequestIfDateIsInFuture()
        {
            var applicationNumber = "applicationNumber";
            var date = DateTime.Now.AddDays(10);

            var response = await buildingApplicationFunctions.UpdateSafetyCaseDeclaration(BuildHttpRequestData(new SafetyCaseReportRequestModel { ApplicationNumber = applicationNumber, Date = date }));

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _dynamicServiceMock.Verify(x => x.UpdateSafetyCaseReportSubmissionDate(applicationNumber, date), Times.Never);
        }
    }
}
