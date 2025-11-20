import { Profile } from './types';

export function CreativeTemplate({ profile, cardUrl }: { profile: Profile; cardUrl?: string }) {
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
    <div className="bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 dark:from-pink-900 dark:via-yellow-900 dark:to-orange-900 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-pink-200 dark:border-pink-700">
      <div className="text-center mb-8">
        {profile.avatar && (
          <div className="relative inline-block mb-6">
            <img
              src={profile.avatar}
              alt={profile.name || 'Avatar'}
              className="w-36 h-36 rounded-full mx-auto border-4 border-pink-500 shadow-xl"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"></div>
          </div>
        )}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">
          {profile.name || 'Anonymous'}
        </h1>
        {profile.title && (
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {profile.title}
          </p>
        )}
        {profile.bio && (
          <p className="text-gray-700 dark:text-gray-200 max-w-xl mx-auto text-lg">
            {profile.bio}
          </p>
        )}
      </div>

      {(profile.email || profile.phone || profile.website) && (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-pink-600 dark:text-pink-400 font-semibold hover:bg-pink-50 dark:hover:bg-pink-900 transition-colors"
            >
              📧 {profile.email}
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors"
            >
              🌐 Visit Website
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
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
          >
            🐦 Twitter
          </a>
        )}
        {profile.github && (
          <a
            href={getSocialUrl('github', profile.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            💻 GitHub
          </a>
        )}
        {profile.instagram && (
          <a
            href={getSocialUrl('instagram', profile.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            📸 Instagram
          </a>
        )}
        {profile.customLinks?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded-full font-bold hover:bg-pink-50 dark:hover:bg-pink-900 transition-all transform hover:scale-105 shadow-md"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

