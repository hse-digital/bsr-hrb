// using HSEPortal.API.Functions;
// using HSEPortal.API.Model;
// using HSEPortal.API.Model.DynamicsSynchronisation;
// using HSEPortal.Domain.DynamicsDefinitions;
// using HSEPortal.Domain.Entities;
// using Microsoft.DurableTask;
// using Microsoft.DurableTask.Client;
// using Moq;
// using Xunit;
//
// namespace HSEPortal.API.UnitTests.DynamicsSynchronisation;
//
// public class WhenSavingStructuresInformation : UnitTestBase
// {
//     private const string DynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";
//
//     private readonly Mock<DurableTaskClient> durableTaskClient;
//     private readonly Mock<TaskOrchestrationContext> taskOrchestrationContext;
//     private readonly DynamicsSynchronisationFunctions dynamicsSynchronisationFunctions;
//
//     private static readonly BuildingApplicationModel buildingApplicationModel = CreateBuildingApplicationModel();
//     private static readonly DynamicsBuildingApplication dynamicsBuildingApplication = new(buildingApplicationModel.Id, bsr_buildingapplicationid: "891478D0-0A69-4856-B941-B6FE0E8B8BC1", bsr_registreeId: "B39E5B3C-B18D-40C0-BA27-64EB1C0B7477", bsr_building: "55CC44E6-8B92-4155-9DFC-CD118323326B");
//     private static readonly DynamicsYear dynamicsYear = new("2020", "B36ECD8A-1421-44C2-8094-F2E7532DA61A");
//     private static readonly DynamicsYearRange dynamicsYearRange = new("1901-to-1955", "7ED83A9A-79CA-43D1-BFAA-61D262046B10");
//
//     public WhenSavingStructuresInformation()
//     {
//         dynamicsSynchronisationFunctions = new DynamicsSynchronisationFunctions(DynamicsService);
//         durableTaskClient = new Mock<DurableTaskClient>("DurableTaskClientName");
//
//         taskOrchestrationContext = new Mock<TaskOrchestrationContext>();
//         SetupResponses();
//         SetupOrchestration();
//     }
//
//     [Fact]
//     public async Task ShouldStartNewOrchestrationForSyncingBuildingStructures()
//     {
//         var requestData = BuildHttpRequestData(buildingApplicationModel);
//         await dynamicsSynchronisationFunctions.SyncBuildingStructures(requestData, durableTaskClient.Object);
//
//         durableTaskClient.Verify(x => x.ScheduleNewOrchestrationInstanceAsync(nameof(DynamicsSynchronisationFunctions.SynchroniseBuildingStructures), buildingApplicationModel, It.IsAny<StartOrchestrationOptions>(), It.IsAny<CancellationToken>()));
//     }
//
//     [Fact]
//     public async Task ShouldCallActivityToGetBuildingApplicationUsingId()
//     {
//         await dynamicsSynchronisationFunctions.SynchroniseBuildingStructures(taskOrchestrationContext.Object);
//
//         taskOrchestrationContext.Verify(x => x.CallActivityAsync<DynamicsBuildingApplication>(nameof(dynamicsSynchronisationFunctions.GetBuildingApplicationUsingId), buildingApplicationModel.Id, It.IsAny<TaskOptions>()));
//     }
//
//     [Fact]
//     public async Task ShouldCallDynamicsToGetBuildingApplicationUsingId()
//     {
//         await dynamicsSynchronisationFunctions.GetBuildingApplicationUsingId(buildingApplicationModel.Id);
//
//         HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications")
//             .WithQueryParam("$filter", $"bsr_applicationreturncode eq '{buildingApplicationModel.Id}'")
//             .WithOAuthBearerToken(DynamicsAuthToken)
//             .WithVerb(HttpMethod.Get);
//     }
//
//     [Fact]
//     public async Task ShouldCallActivityToUpdateBuildingApplicationStage()
//     {
//         await dynamicsSynchronisationFunctions.SynchroniseBuildingStructures(taskOrchestrationContext.Object);
//
//         taskOrchestrationContext.Verify(x => x.CallActivityAsync(nameof(dynamicsSynchronisationFunctions.UpdateBuildingApplicationStage), dynamicsBuildingApplication, It.IsAny<TaskOptions>()));
//     }
//
//     [Fact]
//     public async Task ShouldCallDynamicsToUpdateBuildingApplicationWithStage()
//     {
//         await dynamicsSynchronisationFunctions.UpdateBuildingApplicationStage(dynamicsBuildingApplication);
//
//         HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})")
//             .WithOAuthBearerToken(DynamicsAuthToken)
//             .WithVerb(HttpMethod.Put)
//             .WithRequestJson(dynamicsBuildingApplication with { bsr_ApplicationStage = "Building Summary" });
//     }
//
//     [Fact]
//     public async Task ShouldCallActivityToCreateStructures()
//     {
//         await dynamicsSynchronisationFunctions.SynchroniseBuildingStructures(taskOrchestrationContext.Object);
//
//         var structures = new Structures(buildingApplicationModel.Sections, dynamicsBuildingApplication);
//         taskOrchestrationContext.Verify(x => x.CallActivityAsync(nameof(dynamicsSynchronisationFunctions.CreateBuildingStructures), structures, It.IsAny<TaskOptions>()));
//     }
//
//     [Fact]
//     public async Task ShouldCallDynamicsToGetYearsAndYearRanges()
//     {
//         var structures = new Structures(buildingApplicationModel.Sections, dynamicsBuildingApplication);
//         await dynamicsSynchronisationFunctions.CreateBuildingStructures(structures);
//     }
//
//     [Fact]
//     public async Task ShouldCallDynamicsToCreateAllStructuresAndAddresses()
//     {
//         var structures = new Structures(buildingApplicationModel.Sections, dynamicsBuildingApplication);
//         await dynamicsSynchronisationFunctions.CreateBuildingStructures(structures);
//
//         foreach (var sectionModel in structures.BuildingStructures)
//         {
//             var structure = new Structure(sectionModel.Name, sectionModel.FloorsAbove, sectionModel.Height, sectionModel.ResidentialUnits, sectionModel.PeopleLivingInBuilding, sectionModel.YearOfCompletionOption, sectionModel.YearOfCompletion, sectionModel.YearOfCompletionRange);
//
//             var dynamicsStructure = new StructureDefinition().BuildDynamicsEntity(structure);
//             if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.Exact)
//             {
//                 HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_years")
//                     .WithQueryParam("?$filter", $"bsr_name eq '{structure.ExactYear}'")
//                     .WithOAuthBearerToken(DynamicsAuthToken)
//                     .WithVerb(HttpMethod.Get);
//             }
//
//             if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.YearRange)
//             {
//                 HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_sectioncompletionyearranges")
//                     .WithQueryParam("?$filter", $"bsr_name eq '{structure.YearRange.Replace("-", " ")}'")
//                     .WithOAuthBearerToken(DynamicsAuthToken)
//                     .WithVerb(HttpMethod.Get);
//             }
//             
//             HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_blocks")
//                 .WithOAuthBearerToken(DynamicsAuthToken)
//                 .WithVerb(HttpMethod.Post)
//                 .WithRequestJson(dynamicsStructure);
//         }
//     }
//
//     private void SetupResponses()
//     {
//         HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = DynamicsAuthToken });
//         HttpTest.RespondWithJson(new DynamicsResponse<DynamicsBuildingApplication> { value = new List<DynamicsBuildingApplication> { dynamicsBuildingApplication } });
//         HttpTest.RespondWithJson(new DynamicsResponse<DynamicsYear> { value = new List<DynamicsYear> { dynamicsYear } });
//         HttpTest.RespondWithJson(new DynamicsResponse<DynamicsYearRange> { value = new List<DynamicsYearRange> { dynamicsYearRange } });
//     }
//
//     private void SetupOrchestration()
//     {
//         taskOrchestrationContext.Setup(x => x.GetInput<BuildingApplicationModel>()).Returns(buildingApplicationModel);
//         taskOrchestrationContext.Setup(x => x.CallActivityAsync<DynamicsBuildingApplication>(nameof(dynamicsSynchronisationFunctions.GetBuildingApplicationUsingId), buildingApplicationModel.Id, It.IsAny<TaskOptions>())).Returns(Task.FromResult(dynamicsBuildingApplication));
//     }
//
//     private static BuildingApplicationModel CreateBuildingApplicationModel()
//     {
//         return new BuildingApplicationModel("HRB123123123", Sections: new[]
//         {
//             new SectionModel("section 1", "22", "55", "yes", "20", "year-exact", "2020", null, "certificateissuer", "certificatenumber", Addresses: new[]
//             {
//                 new BuildingAddress
//                 {
//                     Address = "addressLine1",
//                     Number = "addressLine2",
//                     Town = "city",
//                     Postcode = "postcode",
//                     UPRN = "uprn",
//                     USRN = "usrn"
//                 }
//             }),
//             new SectionModel("section 2", "11", "44", "no_wont_move", "20", "year-not-exact", null, "1970-to-1984", "certificateissuer", "certificatenumber", Addresses: new[]
//             {
//                 new BuildingAddress
//                 {
//                     Address = "addressLine1",
//                     Number = "addressLine2",
//                     Town = "city",
//                     Postcode = "postcode",
//                     UPRN = "uprn",
//                     USRN = "usrn"
//                 },
//                 new BuildingAddress
//                 {
//                     Address = "2-addressLine1",
//                     Number = "2-addressLine2",
//                     Town = "2-city",
//                     Postcode = "2-postcode",
//                     UPRN = "2-uprn",
//                     USRN = "2-usrn"
//                 }
//             })
//         });
//     }
// }