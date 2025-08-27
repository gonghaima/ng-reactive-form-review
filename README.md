calculation surcharge

```
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CardDetailsService {
    merchantId = 'zzzazdjkjsdlf';
    anzClientId = 'dafsadsfdsaf';
    apcClientId = 'kjkadfaf223fdssafs';
    
    // ANZ Worldline configuration
    private readonly anzBaseUrl = 'https://payment.preprod.anzworldline-solutions.com.au/v2';
    private readonly hardcodedBin = '513700'; // As specified in requirements
    
    constructor(private http: HttpClient) {}
    
    async createPayment(postPaymentBody: any): Promise<any> {
        // Your existing implementation
        // ...
    }
    
    /**
     * Get IIN details from ANZ Worldline API
     * @param paymentContext Payment context information
     * @param bin Bank Identification Number (defaults to hardcoded value)
     * @returns Promise with IIN details response
     */
    async getIINDetails(paymentContext: {
        amount: number;
        currencyCode?: string;
        countryCode?: string;
        isRecurring?: boolean;
    }, bin: string = this.hardcodedBin): Promise<any> {
        const url = `${this.anzBaseUrl}/${this.merchantId}/services/getIINdetails`;
        
        // Default payment context values
        const defaultPaymentContext = {
            amount: 1000,
            currencyCode: 'AUD',
            countryCode: 'AU',
            isRecurring: false
        };
        
        // Merge provided context with defaults
        const finalPaymentContext = {
            ...defaultPaymentContext,
            ...paymentContext
        };
        
        const requestBody = {
            bin: bin,
            paymentContext: {
                amountOfMoney: {
                    amount: finalPaymentContext.amount,
                    currencyCode: finalPaymentContext.currencyCode
                },
                countryCode: finalPaymentContext.countryCode,
                isRecurring: finalPaymentContext.isRecurring
            }
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.anzClientId}`,
            'Accept': 'application/json'
        });

        try {
            const response = await firstValueFrom(
                this.http.post(url, requestBody, { headers })
            );
            
            console.log('IIN Details Response:', response);
            
            // Log key information from the response
            if ((response as any).paymentProductId) {
                const data = response as any;
                console.log(`Card detected: ${data.cardScheme} ${data.cardType} (Product ID: ${data.paymentProductId})`);
                console.log(`Issuer: ${data.issuerName} (${data.issuingCountryCode})`);
                console.log(`Allowed in context: ${data.isAllowedInContext}`);
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching IIN details:', error);
            throw error;
        }
    }

    /**
     * Calculate surcharge using ANZ Worldline API
     * @param surchargeParams Parameters for surcharge calculation
     * @param iinDetails Optional IIN details from previous API call
     * @returns Promise with surcharge calculation response
     */
    async calculateSurcharge(surchargeParams: {
        amount: number;
        currency?: string;
        countryCode?: string;
        isRecurring?: boolean;
        paymentProductId?: number;
        cardSource?: {
            card?: {
                cardNumber: string;
                paymentProductId: number;
            };
            token?: string;
            hostedTokenizationId?: string;
            encryptedCustomerInput?: string;
        };
    }, iinDetails?: any): Promise<any> {
        const url = `${this.anzBaseUrl}/${this.merchantId}/services/surchargecalculation`;
        
        // If IIN details not provided, fetch them first
        if (!iinDetails) {
            const paymentContext = {
                amount: surchargeParams.amount,
                currencyCode: surchargeParams.currency || 'AUD',
                countryCode: surchargeParams.countryCode || 'AU',
                isRecurring: surchargeParams.isRecurring || false
            };
            iinDetails = await this.getIINDetails(paymentContext);
        }

        // Build card source - use provided cardSource or create default with hardcoded BIN
        let cardSource = surchargeParams.cardSource;
        
        if (!cardSource) {
            // Default card source using hardcoded BIN
            // Use paymentProductId from IIN details if available, otherwise default to 840
            const paymentProductId = (iinDetails && iinDetails.paymentProductId) 
                ? iinDetails.paymentProductId 
                : (surchargeParams.paymentProductId || 840);
                
            cardSource = {
                card: {
                    cardNumber: this.hardcodedBin + "000000000", // Pad to make it look like a card number (16 digits)
                    paymentProductId: paymentProductId
                }
            };
            
            console.log(`Using default card source with BIN ${this.hardcodedBin} and payment product ID ${paymentProductId}`);
        }

        const requestBody = {
            cardSource: cardSource,
            amountOfMoney: {
                amount: surchargeParams.amount,
                currencyCode: surchargeParams.currency || 'AUD'
            }
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.anzClientId}`,
            'Accept': 'application/json'
        });

        try {
            const response = await firstValueFrom(
                this.http.post(url, requestBody, { headers })
            );
            
            console.log('Surcharge Calculation Response:', response);
            return response;
        } catch (error) {
            console.error('Error calculating surcharge:', error);
            throw error;
        }
    }

    /**
     * Complete surcharge calculation workflow
     * Fetches IIN details first, then calculates surcharge
     * @param surchargeParams Parameters for surcharge calculation
     * @returns Promise with complete workflow result
     */
    async completeSurchargeCalculation(surchargeParams: {
        amount: number;
        currency?: string;
        countryCode?: string;
        isRecurring?: boolean;
        paymentProductId?: number;
        cardSource?: {
            card?: {
                cardNumber: string;
                paymentProductId: number;
            };
            token?: string;
            hostedTokenizationId?: string;
            encryptedCustomerInput?: string;
        };
    }): Promise<{
        success: boolean;
        iinDetails?: any;
        surchargeCalculation?: any;
        error?: string;
        validationErrors?: string[];
        timestamp: string;
    }> {
        try {
            console.log('Starting surcharge calculation workflow...');
            
            // Step 1: Get IIN details
            console.log('Step 1: Fetching IIN details...');
            const paymentContext = {
                amount: surchargeParams.amount,
                currencyCode: surchargeParams.currency || 'AUD',
                countryCode: surchargeParams.countryCode || 'AU',
                isRecurring: surchargeParams.isRecurring || false
            };
            const iinDetails = await this.getIINDetails(paymentContext);
            
            // Basic validation
            if (!iinDetails.isAllowedInContext) {
                console.warn('Card is not allowed in the current context');
                return {
                    success: false,
                    error: 'Card is not allowed in the current context',
                    validationErrors: ['Card not allowed in context'],
                    iinDetails: iinDetails,
                    timestamp: new Date().toISOString()
                };
            }
            
            // Step 2: Calculate surcharge
            console.log('Step 2: Calculating surcharge...');
            const surchargeResult = await this.calculateSurcharge(surchargeParams, iinDetails);
            
            return {
                success: true,
                iinDetails: iinDetails,
                surchargeCalculation: surchargeResult,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            console.error('Surcharge calculation workflow failed:', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred',
                timestamp: new Date().toISOString()
            };
        }
    }
}
```
