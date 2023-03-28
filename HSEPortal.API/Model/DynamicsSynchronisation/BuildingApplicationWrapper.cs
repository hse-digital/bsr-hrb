using HSEPortal.API.Model.Payment.Response;
using HSEPortal.Domain.Entities;

namespace HSEPortal.API.Model.DynamicsSynchronisation;

public record BuildingApplicationWrapper(BuildingApplicationModel Model, DynamicsBuildingApplication DynamicsBuildingApplication, BuildingApplicationStage Stage);

public record BuildingApplicationPayment(string BuildingApplicationId, PaymentResponseModel Payment);