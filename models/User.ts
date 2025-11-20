import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  ensName?: string;
  slug: string; // unique URL slug
  
  // Profile information
  displayName?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  // Social links
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    farcaster?: string;
    telegram?: string;
    discord?: string;
    instagram?: string;
    youtube?: string;
    custom?: { label: string; url: string }[];
  };
  
  // Card settings
  cardSettings: {
    theme: 'minimal' | 'corporate' | 'creative' | 'blockchain';
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    showAvatar: boolean;
    showQRCode: boolean;
  };
  
  // NFT & Physical card
  nftTokenId?: string;
  nftContract?: string;
  physicalCardOrdered: boolean;
  physicalCardStatus?: 'pending' | 'printed' | 'shipped' | 'delivered';
  
  // Analytics
  views: number;
  lastViewed?: Date;
  
  // Subscription
  subscriptionTier: 'free' | 'pro';
  subscriptionExpiresAt?: Date;
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ensName: {
      type: String,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: String,
    title: String,
    bio: String,
    avatar: String,
    email: String,
    phone: String,
    website: String,
    socials: {
      twitter: String,
      linkedin: String,
      github: String,
      farcaster: String,
      telegram: String,
      discord: String,
      instagram: String,
      youtube: String,
      custom: [
        {
          label: String,
          url: String,
        },
      ],
    },
    cardSettings: {
      theme: {
        type: String,
        enum: ['minimal', 'corporate', 'creative', 'blockchain'],
        default: 'minimal',
      },
      primaryColor: {
        type: String,
        default: '#3B82F6',
      },
      backgroundColor: {
        type: String,
        default: '#FFFFFF',
      },
      fontFamily: {
        type: String,
        default: 'Inter',
      },
      showAvatar: {
        type: Boolean,
        default: true,
      },
      showQRCode: {
        type: Boolean,
        default: true,
      },
    },
    nftTokenId: String,
    nftContract: String,
    physicalCardOrdered: {
      type: Boolean,
      default: false,
    },
    physicalCardStatus: {
      type: String,
      enum: ['pending', 'printed', 'shipped', 'delivered'],
    },
    views: {
      type: Number,
      default: 0,
    },
    lastViewed: Date,
    subscriptionTier: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    subscriptionExpiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ ensName: 1 });
UserSchema.index({ slug: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

