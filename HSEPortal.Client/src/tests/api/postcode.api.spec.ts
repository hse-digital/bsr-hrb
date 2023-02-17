import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { PostcodeAPI } from 'src/app/helpers/API/postcode.api';

let httpClient: HttpClient;

describe('Postcode API', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    }).compileComponents();
    httpClient = TestBed.get(HttpClient);
  });

  it('should get values using postcode', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result: any = await postcodeAPI.getDataUsingPostcode("PE1 1UN");
    
    expect(result).not.toBeNull();
  })));

  it('should get values using address', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result: any = await postcodeAPI.getDataUsingAddressOnLPI("10, BRESSENDEN PLACE, LONDON, CITY OF WESTMINSTER");
    
    expect(result).not.toBeNull();
  })));

  it('should get address using postcode on DPA dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingPostcodeOnDPA("PE1 1UN");

    validateResult(result);
  })));

  it('should get address using postcode on LPI dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingPostcodeOnLPI("PE1 1UN");

    validateResult(result);
  })));

  it('should get building names using postcode on DPA dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getBuildingNamesUsingPostcodeOnDPA("PE1 1UN");

    validateResult(result);
  })));

  it('should get Organisation using postcode on LPI dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getOrganisationsUsingPostcodeOnLPI("PE1 1UN");

    validateResult(result);
  })));

  it('should get Address using address on LPI dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingAddressOnLPI("10, BRESSENDEN PLACE, LONDON, CITY OF WESTMINSTER");

    validateResult(result);
  })));

  it('should NOT get Address using a wrong address on LPI dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingAddressOnLPI("asdf");

    resultIsEmpty(result);
  })));

  it('should NOT get Address using wrong postcode format on DPA dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingPostcodeOnDPA("asdf");

    resultIsEmpty(result);
  })));

  it('should NOT get Address using non-existant postcode on DPA dataset', async(inject([HttpClient], async (httpClient: HttpClient) => {
    let postcodeAPI = new PostcodeAPI(httpClient);
    let result = await postcodeAPI.getAddressUsingPostcodeOnDPA("PE1 9UN");

    resultIsEmpty(result);
  })));
});


function validateResult(result: any) {
  expect(result).not.toBeNull();
  expect(result.length).toBeGreaterThan(0);
  expect(result.find((x: any) => x === '' || x === undefined)).toBeUndefined();
}

function resultIsEmpty(result: any) {
  expect(result.length).toEqual(0);
}
