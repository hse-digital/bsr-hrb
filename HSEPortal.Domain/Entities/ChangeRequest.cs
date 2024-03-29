using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsChangeRequest(
    [property: JsonPropertyName("bsr_buildingapplicationid@odata.bind")]
    string buildingApplicationId = null,
    [property: JsonPropertyName("bsr_building@odata.bind")]
    string building = null,
    [property: JsonPropertyName("bsr_structureid@odata.bind")]
    string structure = null,
    [property: JsonPropertyName("bsr_changecategoryid@odata.bind")]
    string changeCategory = null,
    string bsr_changedescription = null,
    bool? bsr_declaration = null,
    string bsr_name = null,
    bool? bsr_reviewrequired = null,
    [property: JsonPropertyName("bsr_submittedbyid@odata.bind")]
    string applicantReferenceId = null,
    int? statuscode = null,
    int? bsr_papchangecategory = null);

public record DynamicsChange(
    [property: JsonPropertyName("bsr_changerequestid@odata.bind")]
    string changeRequestId = null,
    string bsr_fieldname = null,
    string bsr_name = null,
    string bsr_newanswer = null,
    string bsr_originalanswer = null,
    string bsr_table = null,
    DynamicsChangeRequest bsr_changerequestid = null
);

public record DynamicsChangeRequestResponse(
    DynamicsChangeResponse[] bsr_change_changerequestid = null,
    string bsr_name = null,
    bool bsr_reviewrequired = false,
    bool bsr_declaration = false,
    string _bsr_changecategoryid_value = null
);

public record DynamicsChangeResponse(
    string bsr_fieldname = null,
    string bsr_name = null,
    string bsr_newanswer = null,
    string bsr_originalanswer = null,
    string bsr_table = null
);
