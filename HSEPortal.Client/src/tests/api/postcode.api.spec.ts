import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { firstValueFrom } from "rxjs";
import { PostcodeValidator } from '../../app/helpers/validators/postcode-validator';

let httpClient: HttpClient;

describe('Postcode API', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    }).compileComponents();
    httpClient = TestBed.get(HttpClient);
  });

  it('should get values', async(inject([HttpClient], (httpClient: HttpClient) => {
    let postcodeValidator = new PostcodeValidator(httpClient);
    let result = postcodeValidator.getData("PE1 1UN");
    expect(result).not.toBeNull();
  }))); 
});
