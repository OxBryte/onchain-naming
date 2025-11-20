import mongoose, { Schema, Document } from 'mongoose';

export interface IDomain extends Document {
  domainName: string;
  ownerAddress: string;
  registrationDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  metadata?: {
    email?: string;
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    twitter?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema: Schema = new Schema(
  {
    domainName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

DomainSchema.index({ domainName: 1 });
DomainSchema.index({ ownerAddress: 1 });

export default mongoose.models.Domain || mongoose.model<IDomain>('Domain', DomainSchema);

