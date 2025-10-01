dep

```
import { defer, lastValueFrom, scheduled, asyncScheduler } from 'rxjs';
import { mergeMap, map, toArray } from 'rxjs/operators';

async callGetCards({ crn }, headers): Promise<unknown> {
  try {
    const paymentHeaders = this.generateHeaders(headers);

    const cardsData = await this.cardRepository.find({ crn });

    const paymentURL = GlobalConstants.getPaymentURL(
      this.anzWorldlineUrl,
      this.merchantId,
    );

    const combinedData = await lastValueFrom(
      scheduled(cardsData, asyncScheduler).pipe(   // ✅ replaces from(cardsData)
        mergeMap((card) =>
          defer(() =>
            this.restService.callGet(
              GlobalConstants.getTokenURL(
                this.anzWorldlineUrl,
                this.merchantId,
                card.token,
              ),
              paymentHeaders,
            ),
          ).pipe(
            map((tokenInfo) => {                   // ✅ closure only, no thisArg
              return {
                ...card,
                tokenInfo,
              };
            }),
          ),
        ),
        toArray(), // ✅ still valid
      ),
    );

    return combinedData;
  } catch (error) {
    this.logger.error('Error getting cards:', error);
    throw error;
  }
}

```
