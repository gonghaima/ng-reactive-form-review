controller test

```
import { Test, TestingModule } from '@nestjs/testing';
import { MakeAPaymentController } from './make-a-payment.controller';
import { MakeAPaymentService } from '../services/make-a-payment/make-a-payment.service';
import { GlobalConstants, callCreateBody, CreatePaymentResponse } from '@childsupport/core';
import { Request } from 'express';

describe('MakeAPaymentController', () => {
  let controller: MakeAPaymentController;
  let service: MakeAPaymentService;

  const mockMakeAPaymentService = {
    callSubmitPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeAPaymentController],
      providers: [
        {
          provide: MakeAPaymentService,
          useValue: mockMakeAPaymentService,
        },
      ],
    }).compile();

    controller = module.get<MakeAPaymentController>(MakeAPaymentController);
    service = module.get<MakeAPaymentService>(MakeAPaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.callSubmitPayment with correct params', async () => {
    const body: callCreateBody = {
      csrn: '12345',
      tokenId: 'token-abc',
      amount: 200,
    };

    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as unknown as Request;

    const expectedResponse: CreatePaymentResponse = {
      success: true,
      paymentId: 'pay-001',
    } as CreatePaymentResponse;

    mockMakeAPaymentService.callSubmitPayment.mockResolvedValue(expectedResponse);

    const result = await controller.callCreatePayment(body, mockRequest);

    expect(service.callSubmitPayment).toHaveBeenCalledWith({
      csrn: body.csrn,
      token_id: body.tokenId,
      amount: body.amount,
      headers: mockRequest.headers,
    });
    expect(result).toEqual(expectedResponse);
  });
});

```
