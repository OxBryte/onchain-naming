import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  // Identity
  ensName?: string;
  walletAddress: string;
  slug: string; // Unique slug for URL (e.g., "vitalik.eth" or "0x123...")
  
  // Profile data
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  // Social links
  twitter?: string;
  linkedin?: string;
  farcaster?: string;
  github?: string;
  instagram?: string;
  customLinks?: Array<{
    label: string;
    url: string;
  }>;
  
  // Card customization
  template: string; // Template theme name
  customCSS?: string;
  customDomain?: string; // Custom domain mapping (Pro feature)
  
  // Analytics
  viewCount: number;
  lastViewedAt?: Date;
  
  // Settings
  isPublished: boolean;
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    ensName: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: String,
    title: String,
    bio: String,
    avatar: String,
    email: String,
    phone: String,
    website: String,
    twitter: String,
    linkedin: String,
    farcaster: String,
    github: String,
    instagram: String,
    customLinks: [
      {
        label: String,
        url: String,
      },
    ],
    template: {
      type: String,
      default: 'minimal',
    },
    customCSS: String,
    customDomain: String,
    viewCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: Date,
    isPublished: {
      type: Boolean,
      default: false,
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

ProfileSchema.index({ walletAddress: 1 });
ProfileSchema.index({ slug: 1 });
ProfileSchema.index({ ensName: 1 });

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

