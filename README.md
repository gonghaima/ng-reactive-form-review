get schema
```
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the document type
export type CardDocument = Card & Document;

@Schema({ timestamps: true }) // It's good practice to keep timestamps enabled
export class Card {
  // @Prop({ type: String }) is needed for basic types like string, number, etc.

  @Prop({
    type: String,
    required: true, // Assuming this is the customer ID field and should always be present
  })
  csrn: string;

  @Prop({
    type: String,
    required: true,
  })
  token: string;

  @Prop({
    type: String,
    // Define an array of allowed values (enum) for validation
    enum: ['used', 'saved', 'preferred'], 
    // Set the default value to "used"
    default: 'used', 
  })
  status: string;
}

// Create the Mongoose Schema from the class
export const CardSchema = SchemaFactory.createForClass(Card);
```
