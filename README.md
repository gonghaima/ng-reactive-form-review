Testing for mongoose util
```javascript
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MakeAPaymentBffService } from './make-a-payment-bff.service';
import { RestService } from '@childsupport/core'; // Assuming RestService is from this path
import { ErrorsEnum } from '@dhs/child-support-shared/dist/shared-swagger';

// Mock the RestService
const mockRestService = {
  callPost: jest.fn(),
};

describe('MakeAPaymentBffService', () => {
  let service: MakeAPaymentBffService;
  let restService: RestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeAPaymentBffService,
        {
          provide: RestService,
          useValue: mockRestService,
        },
      ],
    }).compile();

    service = module.get<MakeAPaymentBffService>(MakeAPaymentBffService);
    restService = module.get<RestService>(RestService);
  });

  // Test to ensure the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitPayment', () => {
    it('should successfully submit a payment and return the result', async () => {
      const mockResponse = {
        transactionId: '12345',
        status: 'SUCCESS',
      };

      // Mock the successful response from the RestService's callPost method
      mockRestService.callPost.mockResolvedValue(mockResponse);

      const csrn = 'testCsrn';
      const tokenId = 'testToken';
      const amount = 100.00;

      const result = await service.submitPayment(csrn, tokenId, amount);

      // Verify that the mocked callPost method was called
      expect(mockRestService.callPost).toHaveBeenCalled();
      // Verify the returned result matches the mock response
      expect(result).toEqual(mockResponse);
    });
  });

  describe('callFinancialService', () => {
    it('should return a successful response from the API call', async () => {
      const mockResponse = {
        transactionId: '12345',
        status: 'SUCCESS',
      };
      // Mock a successful API call
      mockRestService.callPost.mockResolvedValue(mockResponse);

      const body = { csrn: 'test' };
      const url = 'http://test.com/api';

      const result = await service.callFinancialService(body, url);

      expect(mockRestService.callPost).toHaveBeenCalledWith(url, body);
      expect(result).toEqual(mockResponse);
    });

    it('should throw a BadRequestException on API call failure', async () => {
      // Mock a failed API call (e.g., a network error or HTTP error)
      mockRestService.callPost.mockRejectedValue(new Error('API error'));

      const body = { csrn: 'test' };
      const url = 'http://test.com/api';

      // Expect the service to throw a BadRequestException
      await expect(service.callFinancialService(body, url)).rejects.toThrow(
        BadRequestException,
      );
      // Ensure the error message matches what's expected from the service's logic
      await expect(service.callFinancialService(body, url)).rejects.toThrow(
        ErrorsEnum.GENERIC_ERROR.getKey,
      );
    });
  });
});

```
