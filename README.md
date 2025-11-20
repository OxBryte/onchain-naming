# OnChain Naming - Universal Business Card Platform

A Web3-native platform for creating and sharing digital business cards linked to ENS domains. Build your identity, share it with a link or QR code, and optionally order physical NFC cards.

## Features

### ✅ Phase 1 (MVP) - Completed
- **Wallet Authentication**: Connect with MetaMask, WalletConnect, or any Web3 wallet
- **ENS Integration**: Automatically loads ENS profile data (avatar, text records)
- **Profile Builder**: Comprehensive profile editor with live preview
- **Digital Cards**: Beautiful, shareable digital cards with QR codes
- **Unique URLs**: Each card gets a unique slug (e.g., `/card/vitalik.eth`)
- **Analytics Dashboard**: Track views and manage your profile
- **MongoDB Storage**: Secure profile storage with MongoDB

### ✅ Phase 2 - Completed
- **Multiple Card Templates**: Choose from 5 beautiful themes:
  - **Minimal**: Clean and simple design with blue/purple gradients
  - **Corporate**: Professional business style with gray tones
  - **Creative**: Bold and colorful with vibrant gradients
  - **Dark Mode**: Modern dark theme with indigo accents
  - **Gradient**: Vibrant gradient design with purple/pink/red colors
- **Template Selection**: Easy template picker in profile builder with live preview
- **Template System**: Extensible architecture for adding new templates

### 🚧 Phase 3 (Coming Soon)
- ENS-NFT minting for card ownership
- Advanced analytics (location, device tracking)

### 🔮 Phase 4 (Future)
- Physical NFC card ordering integration
- Print-on-demand API integration
- Custom domain mapping (Pro feature)

### 💳 Phase 5 (Future)
- Crypto-backed payment cards
- USDC/USDT prepaid card integration
- KYC/Compliance features

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Web3**: Wagmi, Viem, Reown AppKit (WalletConnect)
- **Database**: MongoDB with Mongoose
- **ENS**: Viem ENS resolution
- **QR Codes**: qrcode library
- **Authentication**: SIWE (Sign-In with Ethereum)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- WalletConnect Project ID from [Reown Cloud](https://cloud.reown.com)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd onchain-naming
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/onchain-naming
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onchain-naming

# WalletConnect Project ID (get from https://cloud.reown.com)
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# Optional: Base URL for production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_ORIGIN=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
onchain-naming/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── profiles/      # Profile CRUD endpoints
│   ├── card/[slug]/      # Public card display page
│   ├── dashboard/        # User dashboard
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # Web3 providers
├── components/
│   ├── DigitalCard.tsx   # Card display component
│   ├── ProfileBuilder.tsx # Profile editor
│   ├── DomainSearch.tsx   # ENS domain search
│   └── card-templates/   # Card template components
│       ├── MinimalTemplate.tsx
│       ├── CorporateTemplate.tsx
│       ├── CreativeTemplate.tsx
│       ├── DarkTemplate.tsx
│       ├── GradientTemplate.tsx
│       └── types.ts
├── lib/
│   ├── ens.ts            # ENS resolution utilities
│   ├── auth.ts           # SIWE authentication
│   ├── templates.ts     # Template configuration
│   └── mongodb.ts        # MongoDB connection
├── models/
│   ├── Profile.ts        # Profile schema
│   └── Domain.ts         # Domain schema (legacy)
└── public/               # Static assets
```

## Usage

### Creating Your Card

1. **Connect Wallet**: Click "Connect Wallet" and sign in with your Web3 wallet
2. **Build Profile**: Go to Dashboard and fill in your profile information
   - ENS data is automatically loaded if you have an ENS domain
   - Add social links, contact info, and custom links
   - **Choose a Template**: Select from 5 beautiful card templates (Minimal, Corporate, Creative, Dark, Gradient)
3. **Preview**: See your card in real-time as you edit with live template preview
4. **Publish**: Click "Publish Card" to make it publicly accessible
5. **Share**: Copy your card URL or download the QR code

### Customizing Your Card Template

The platform includes 5 pre-built templates:

- **Minimal** (`minimal`): Default template with clean blue/purple gradients
- **Corporate** (`corporate`): Professional gray-toned design perfect for business
- **Creative** (`creative`): Bold and colorful with pink/orange gradients
- **Dark Mode** (`dark`): Modern dark theme with indigo accents
- **Gradient** (`gradient`): Vibrant purple/pink/red gradient background

You can switch templates anytime in the profile builder, and the preview updates instantly. Each template maintains your profile data while changing the visual style.

### API Endpoints

#### Profiles
- `GET /api/profiles?walletAddress=0x...` - Get profiles by wallet
- `GET /api/profiles?slug=ensname` - Get profile by slug
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles/[slug]` - Get public profile
- `PUT /api/profiles/[slug]` - Update profile (requires auth)

#### ENS
- `GET /api/profiles/ens?ensName=vitalik.eth` - Get ENS data
- `GET /api/profiles/ens?address=0x...` - Resolve address to ENS

#### Authentication
- `GET /api/auth/nonce` - Get nonce for SIWE
- `POST /api/auth/verify` - Verify SIWE signature

## Database Schema

### Profile Model
```typescript
{
  ensName?: string;
  walletAddress: string;
  slug: string;
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  farcaster?: string;
  github?: string;
  instagram?: string;
  customLinks?: Array<{label: string, url: string}>;
  template: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Roadmap

See the [Features](#features) section above for the complete roadmap.

## Support

For issues and questions, please open an issue on GitHub.
