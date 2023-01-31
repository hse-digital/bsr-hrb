using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Flurl.Http;
using Flurl.Http.Testing;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests
{
    internal class WhenSavingBuildingDetails
    {
        private HttpTest httpTest;
        private BuildingFunctions buildingFunctions;

        [SetUp]
        public void Setup()
        {
            httpTest = new HttpTest();
            buildingFunctions = new BuildingFunctions();
        }

        [Test]
        [Category("BuildingDetailsName")]
        public async Task ShouldCallDynamicsWithBuildingDetailsName()
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.Headers.Add("buildingName", "Building Name");

            IFlurlResponse response = await buildingFunctions.SaveBuildingName(request);

            httpTest.ShouldHaveCalled("https://dynamicsapi")
                    .WithRequestJson(new { buildingName = "Building Name" });

            Assert.AreEqual(200, response.StatusCode);
        }

        [Test]
        [Category("BuildingDetailsFloorsAbove")]
        public async Task ShouldCallDynamicsWithBuildingDetailsFloorsAbove()
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.Headers.Add("floorsAbove", "35");

            IFlurlResponse response = await buildingFunctions.SaveBuildingFloorsAbove(request);

            httpTest.ShouldHaveCalled("https://dynamicsapi")
                    .WithRequestJson(new { floorsAbove = "35" });

            Assert.AreEqual(200, response.StatusCode);
        }

        [Test]
        [Category("BuildingDetailsHeight")]
        public async Task ShouldCallDynamicsWithBuildingDetailsHeight()
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.Headers.Add("height", "500");

            IFlurlResponse response = await buildingFunctions.SaveBuildingHeight(request);

            httpTest.ShouldHaveCalled("https://dynamicsapi")
                    .WithRequestJson(new { height = "500" });

            Assert.AreEqual(200, response.StatusCode);
        }

        [Test]
        [Category("BuildingDetailsPeopleLivingInBuilding")]
        [TestCase("760810000")]
        [TestCase("760810001")]
        [TestCase("760810002")]
        public async Task ShouldCallDynamicsWithBuildingDetailsPeopleLivingInBuilding(string radioValue)
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.Headers.Add("peopleLivingInBuilding", radioValue);

            IFlurlResponse response = await buildingFunctions.SaveBuildingPeopleLivingInBuilding(request);

            httpTest.ShouldHaveCalled("https://dynamicsapi")
                    .WithRequestJson(new { peopleLivingInBuilding = radioValue });

            Assert.AreEqual(200, response.StatusCode);
        }

        [Test]
        [Category("BuildingDetailsResidentialUnits")]
        public async Task ShouldCallDynamicsWithBuildingDetailsResidentialUnits()
        {
            HttpRequestMessage request = new HttpRequestMessage();
            request.Headers.Add("residentialUnits", "250");

            IFlurlResponse response = await buildingFunctions.SaveBuildingResidentialUnits(request);

            httpTest.ShouldHaveCalled("https://dynamicsapi")
                    .WithRequestJson(new { residentialUnits = "250" });

            Assert.AreEqual(200, response.StatusCode);
        }
    }
}
