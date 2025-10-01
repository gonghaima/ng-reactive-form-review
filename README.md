tt.

```
import { from } from 'rxjs';
import { mergeMap, map, toArray } from 'rxjs/operators';

async callGetCards({ crn }, headers): Promise<unknown> {
  try {
    const paymentHeaders = this.generateHeaders(headers);

    const cardsData = await this.cardRepository.find({ crn });

    const paymentURL = GlobalConstants.getPaymentURL(
      this.anzWorldlineUrl,
      this.merchantId,
    );

    const tokenURLs = cardsData.map((card) =>
      GlobalConstants.getTokenURL(
        this.anzWorldlineUrl,
        this.merchantId,
        card.token,
      ),
    );

    // Use RxJS to fetch all token infos and combine with cardsData
    const combinedData = await from(cardsData)
      .pipe(
        mergeMap((card) =>
          from(
            this.restService.callGet(
              GlobalConstants.getTokenURL(
                this.anzWorldlineUrl,
                this.merchantId,
                card.token,
              ),
              paymentHeaders,
            ),
          ).pipe(
            map((tokenInfo) => ({
              ...card,
              tokenInfo,
            })),
          ),
        ),
        toArray(), // collect all results into a single array
      )
      .toPromise();

    return combinedData;
  } catch (error) {
    this.logger.error('Error getting cards:', error);
    throw error;
  }
}

```
