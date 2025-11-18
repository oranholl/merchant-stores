import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  description: string;
  city: string;
  cityType: 'big' | 'small';
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    cityType: {
      type: String,
      required: true,
      enum: ['big', 'small'],
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
storeSchema.index({ isActive: 1 });
storeSchema.index({ city: 1 });
storeSchema.index({ cityType: 1 });

export const Store = mongoose.model<IStore>('Store', storeSchema);
