import { Profile } from './types';

export function CorporateTemplate({ profile, cardUrl }: { profile: Profile; cardUrl?: string }) {
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8 md:p-12">
      <div className="text-center mb-8">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.name || 'Avatar'}
            className="w-28 h-28 rounded-lg mx-auto mb-6 border-2 border-gray-300 dark:border-gray-600 shadow-md"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {profile.name || 'Anonymous'}
        </h1>
        {profile.title && (
          <div className="inline-block px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 rounded-lg mb-4">
            {profile.title}
          </div>
        )}
        {profile.bio && (
          <p className="text-gray-700 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>

      {(profile.email || profile.phone || profile.website) && (
        <div className="mb-8 border-t border-b border-gray-200 dark:border-gray-700 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                {profile.phone}
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {profile.twitter && (
          <a
            href={getSocialUrl('twitter', profile.twitter)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Twitter
          </a>
        )}
        {profile.linkedin && (
          <a
            href={getSocialUrl('linkedin', profile.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a
            href={getSocialUrl('github', profile.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-gray-800 dark:bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
          >
            GitHub
          </a>
        )}
        {profile.customLinks?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

