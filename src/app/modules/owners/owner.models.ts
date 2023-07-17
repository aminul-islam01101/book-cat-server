import { Schema, model, Types } from 'mongoose';

import { OwnerModel, TOwner } from './owner.types';

export const ownerSchema = new Schema<TOwner>(
  {
    email: {
      type: String,
      required: true,
    },
    books: [{ type: Types.ObjectId, ref: 'Book' }],
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Owner = model<TOwner, OwnerModel>('Owner', ownerSchema);
