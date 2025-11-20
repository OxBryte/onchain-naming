export interface Profile {
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
  customLinks?: Array<{ label: string; url: string }>;
  template?: string;
  slug?: string;
}

