import { notFound } from 'next/navigation';
import DigitalCard from '@/components/DigitalCard';

async function getProfile(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/profiles/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const { profile } = await res.json();
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function CardPage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = await getProfile(params.slug);

  if (!profile) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const cardUrl = `${baseUrl}/card/${params.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <DigitalCard profile={profile} cardUrl={cardUrl} />
    </div>
  );
}

