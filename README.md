get schemachema = SchemaFactory.createForClass(Card);
```json
import { Injectable } from '@nestjs/common';
import { from, forkJoin, Observable } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
// Assuming RestService's callGet returns a Promise, or you can convert it to one.

// Define the structure of your data for clarity
interface CardData {
  csrn: string;
  token: string;
}

interface TokenInfo {
  card: {
    alias: string;
    id: string;
    data: object;
  };
  // ... other properties from the external API response
}

interface CombinedCardInfo extends CardData {
  tokenInfo: TokenInfo;
}

@Injectable()
export class YourService {
  // ... (dependencies: logger, cardRepository, restService, constants)

  async callGetCards({ crn }, headers): Promise<CombinedCardInfo[]> {
    try {
      const paymentHeaders = this.generateHeaders(headers);
      
      // 1. Get initial card data (Promise-based)
      const cardsData: CardData[] = await this.cardRepository.find({ crn });

      // 2. Map cardsData to an Observable of API calls
      const apiCalls: Observable<TokenInfo>[] = cardsData.map(card => {
        const tokenURL = GlobalConstants.getTokenURL(this.anzWorldlineUrl, this.merchantId, card.token);
        
        // Convert the Promise returned by this.restService.callGet() into an Observable
        return from(this.restService.callGet(tokenURL, paymentHeaders))
          .pipe(
            // Use map to attach the original card data to the token info response
            // This is the CRITICAL step for combining the data.
            map((tokenInfo: TokenInfo) => ({ ...card, tokenInfo }))
          ) as Observable<TokenInfo>; // Asserting type after mapping
      });

      // 3. Use forkJoin to wait for ALL Observables to complete
      // and return the combined array.
      return await forkJoin(apiCalls).toPromise() as CombinedCardInfo[];

    } catch (error) {
      this.logger.error('Error getting cards:', error);
      throw error;
    }
  }
}
```
