using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsPayment(string bsr_paymentid = null, double? bsr_amountpaid = null, string bsr_lastfourdigitsofcardnumber = null, string bsr_timeanddateoftransaction = null, string bsr_transactionid = null,
    [property: JsonPropertyName("bsr_buildingapplicationid@odata.bind")]
    string buildingApplicationReferenceId = null,
    string bsr_service = null,
    string bsr_cardexpirydate = null,
    string bsr_billingaddress = null,
    string bsr_cardbrandegvisa = null,
    DynamicsPaymentCardType? bsr_cardtypecreditdebit = null,
    string bsr_govukpaystatus = null,
    string bsr_govukpaymentid = null,
    DynamicsPaymentReconciliationStatus? bsr_paymentreconciliationstatus = null,
    string bsr_invoicenumber = null,
    int? bsr_paymenttypecode = null,
    string bsr_invoicecreationdate = null,
    [property: JsonPropertyName("bsr_invoicedcontactid@odata.bind")]
    string bsr_invoicedcontactid = null,
    string bsr_purchaseordernumberifsupplied = null,
    string bsr_emailaddress = null);

public enum DynamicsPaymentCardType
{
    Credit = 760810000,
    Debit = 760810001,
}

public enum DynamicsPaymentReconciliationStatus
{
    Pending = 760_810_000,
    Successful = 760_810_001,
    FailedReconciliation = 760_810_002,
    FailedPayment = 760_810_003,
    Refunded = 760_810_004
}