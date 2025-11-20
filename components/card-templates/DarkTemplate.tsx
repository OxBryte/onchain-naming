import { Profile } from './types';

export function DarkTemplate({ profile, cardUrl }: { profile: Profile; cardUrl?: string }) {
  const getSocialUrl = (platform: string, handle: string) => {
    const cleanHandle = handle.replace('@', '');
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${cleanHandle}`;
      case 'github':
        return `https://github.com/${cleanHandle}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanHandle}`;
      case 'farcaster':
        return `https://warpcast.com/${cleanHandle}`;
      case 'instagram':
        return `https://instagram.com/${cleanHandle}`;
      default:
        return '#';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
      <div className="text-center mb-8">
        {profile.avatar && (
          <div className="relative inline-block mb-6">
            <img
              src={profile.avatar}
              alt={profile.name || 'Avatar'}
              className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500 shadow-xl"
            />
            <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 blur-xl"></div>
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-100 mb-2">
          {profile.name || 'Anonymous'}
        </h1>
        {profile.title && (
          <p className="text-xl text-indigo-400 mb-4 font-medium">{profile.title}</p>
        )}
        {profile.bio && (
          <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {(profile.email || profile.phone || profile.website) && (
        <div className="mb-8 space-y-3">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.email}
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {profile.website}
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {profile.twitter && (
          <a
            href={getSocialUrl('twitter', profile.twitter)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors border border-gray-700"
          >
            Twitter
          </a>
        )}
        {profile.github && (
          <a
            href={getSocialUrl('github', profile.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors border border-gray-700"
          >
            GitHub
          </a>
        )}
        {profile.linkedin && (
          <a
            href={getSocialUrl('linkedin', profile.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            LinkedIn
          </a>
        )}
        {profile.farcaster && (
          <a
            href={getSocialUrl('farcaster', profile.farcaster)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            Farcaster
          </a>
        )}
        {profile.customLinks?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold transition-colors border border-gray-700"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

