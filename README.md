cd 
```
import { Model } from 'mongoose';

// In your service or data access layer:
async function updateCardStatusesOrdered(cardModel: Model<any>): Promise<any> {
  const operations = [
    // 1. First operation: Update ALL records with csrn:"875" to card_status: "saved"
    {
      updateMany: {
        filter: { csrn: '875' },
        update: { $set: { card_status: 'saved' } },
      },
    },

    // 2. Second operation: Update the specific record to card_status: "preferred"
    {
      updateOne: {
        filter: { csrn: '875', token: 'tyui' },
        update: { $set: { card_status: 'preferred' } },
      },
    },
  ];

  // Execute the bulk write operation with { ordered: true }
  // This guarantees the operations run sequentially (1 then 2).
  const result = await cardModel.bulkWrite(operations, { ordered: true });
  
  return result;
}
```
