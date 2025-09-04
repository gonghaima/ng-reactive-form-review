service test

```
import { Test, TestingModule } from '@nestjs/testing';
import { MakeAPaymentService } from './make-a-payment.service';
import { RestService } from '@childsupport/common-utils';
import { PaymentLogRepository } from '../../data/make-a-payment/repository/payment-log.repository';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentLog } from '../../data/make-a-payment/schema/payment-log.schema';

describe('MakeAPaymentService', () => {
  let service: MakeAPaymentService;
  let restService: jest.Mocked<RestService>;
  let paymentLogRepository: jest.Mocked<PaymentLogRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeAPaymentService,
        {
          provide: RestService,
          useValue: {
            callPost: jest.fn(),
          },
        },
        {
          provide: PaymentLogRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(PaymentLog.name),
          useValue: {}, // mock mongoose model
        },
      ],
    }).compile();

    service = module.get<MakeAPaymentService>(MakeAPaymentService);
    restService = module.get(RestService);
    paymentLogRepository = module.get(PaymentLogRepository);
  });

  describe('callSubmitPayment', () => {
    const payload = {
      csrn: '12345',
      token_id: 'test-token',
      amount: 1000,
      headers: { custom: 'header' },
    };

    it('should submit payment successfully and log result', async () => {
      const mockResponse = {
        creationOutput: {},
        payment: { id: 'payment-1' },
        merchantAction: {},
      };

      restService.callPost.mockResolvedValueOnce(mockResponse);

      const result = await service.callSubmitPayment(payload);

      expect(restService.callPost).toHaveBeenCalledWith(
        expect.stringContaining('/payments'),
        expect.any(Object),
        expect.any(Object),
      );

      expect(paymentLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          csrn: '12345',
          token_id: 'test-token',
          amount: 1000,
          paymentResult: mockResponse,
        }),
      );

      expect(result).toEqual(mockResponse);
    });

    it('should log error and rethrow when payment submission fails', async () => {
      const mockError = new Error('Payment failed');
      restService.callPost.mockRejectedValueOnce(mockError);

      await expect(service.callSubmitPayment(payload)).rejects.toThrow('Payment failed');

      expect(paymentLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          csrn: '12345',
          token_id: 'test-token',
          amount: 1000,
          error: mockError,
        }),
      );
    });
  });

  describe('setupPostBody', () => {
    it('should return a valid PostPaymentBodyDTO', () => {
      const result = service.setupPostBody({
        token_id: 'token123',
        amount: 500,
        csrn: 'abc123',
      });

      expect(result.hostedTokenizationId).toBe('token123');
      expect(result.order.amountOfMoney.amount).toBe(500);
      expect(result.customer.merchantCustomerId).toBe('abc123');
      expect(result.cardPaymentMethodSpecificInput.threeDSecure.redirectionData.returnUrl).toContain('http');
    });
  });

  describe('generateHeaders', () => {
    it('should return headers with required keys', () => {
      const headers = service.generateHeaders({ foo: 'bar' });

      expect(headers.headers['Content-Type']).toBe('application/json');
      expect(headers.headers['x-anzwl-client-id']).toBeDefined();
      expect(headers.headers['x-sa-client-id']).toBeDefined();
      expect(headers.headers['foo']).toBe('bar');
    });
  });
});

```
