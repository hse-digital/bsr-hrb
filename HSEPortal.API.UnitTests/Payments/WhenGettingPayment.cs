﻿using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.Payments;

public class WhenGettingPayment : UnitTestBase
{
    private PaymentFunctions paymentFunctions;
    private IntegrationsOptions integrationOptions;
    private PaymentApiResponseModel responseApiModel;
    private const string DynamicsToken = "i34h9gf834njgabdiufhgap9384ythgpa9ei48gha;eriough";
    private readonly string paymentId = "1234";
    private readonly string paymentReference = "FG1346780H8904cf680qghcf";

    protected override void AdditionalSetup()
    {
        var paymentReferenceService = new Mock<IPaymentReferenceService>();
        paymentReferenceService.Setup(x => x.Generate()).Returns(paymentReference);
        
        integrationOptions = new IntegrationsOptions { PaymentEndpoint = "https://publicapi.payments.service.gov.uk", PaymentApiKey = "abc123" };
        paymentFunctions = new PaymentFunctions(DynamicsService, paymentReferenceService.Object, new OptionsWrapper<IntegrationsOptions>(integrationOptions), new OptionsWrapper<SwaOptions>(new SwaOptions { Url = "http://localhost:4280" }), mapper: GetMapper());

        responseApiModel = CreatePaymentApiResponse();
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = DynamicsToken });
        HttpTest.RespondWithJson(new { value = new[] { new DynamicsPayment { bsr_govukpaymentid = paymentId } } });
        HttpTest.RespondWithJson(responseApiModel);
    }

    [Test]
    public async Task ShouldCallPaymentApiGetPayment()
    {
        await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentReference), paymentReference);

        HttpTest.ShouldHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}")
            .WithVerb(HttpMethod.Get);
    }

    [Test]
    public async Task ShouldReturnPaymentResponseModel()
    {
        var response = await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, paymentId), paymentId);
        var paymentResponseModel = await response.ReadAsJsonAsync<PaymentResponseModel>();

        paymentResponseModel.Status.Should().Be(responseApiModel.state.status);
        paymentResponseModel.Email.Should().Be(responseApiModel.email);
        paymentResponseModel.Finished.Should().Be(responseApiModel.state.finished);
        paymentResponseModel.PaymentLink.Should().Be(responseApiModel._links.next_url.href);
        paymentResponseModel.CardType.Should().Be(responseApiModel.card_details.card_type);
        paymentResponseModel.CardBrand.Should().Be(responseApiModel.card_details.card_brand);
        paymentResponseModel.LastFourDigitsCardNumber.Should().Be(responseApiModel.card_details.last_digits_card_number);
        paymentResponseModel.AddressLineOne.Should().Be(responseApiModel.card_details.billing_address.line1);
        paymentResponseModel.Postcode.Should().Be(responseApiModel.card_details.billing_address.postcode);
    }

    [TestCase("")]
    [TestCase(null)]
    public async Task ShouldReturnBadRequestIfAmountIsWrong(string id)
    {
        var response = await paymentFunctions.GetPayment(BuildHttpRequestData<object>(default, id), id);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        HttpTest.ShouldNotHaveCalled($"{integrationOptions.PaymentEndpoint}/v1/payments/{paymentId}");
    }

    private PaymentApiResponseModel CreatePaymentApiResponse()
    {
        return new PaymentApiResponseModel
        {
            created_date = "created_date",
            state = new State { finished = false, status = "created" },
            _links = new Links { next_url = new Url { href = "link" } },
            amount = 250,
            email = "user@email.com",
            reference = "12345",
            description = "description",
            return_url = "https://your.service.gov.uk/completed",
            payment_id = "hu20sqlact5260q2nanm0q8u93",
            payment_provider = "worldpay",
            provider_id = "10987654321",
            card_details = new CardDetails
            {
                card_type = "debit",
                card_brand = "Jcb",
                expiry_date = "expiry date",
                last_digits_card_number = "1234",
                first_digits_card_number = "12345",
                billing_address = new BillingAddress
                {
                    line1 = "line1",
                    line2 = "line2",
                    city = "city",
                    country = "country",
                    postcode = "postcode",
                }
            },
        };
    }
}