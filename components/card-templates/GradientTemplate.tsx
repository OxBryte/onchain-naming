import { Profile } from './types';

export function GradientTemplate({ profile, cardUrl }: { profile: Profile; cardUrl?: string }) {
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
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
      <div className="text-center mb-8">
        {profile.avatar && (
          <div className="relative inline-block mb-6">
            <img
              src={profile.avatar}
              alt={profile.name || 'Avatar'}
              className="w-36 h-36 rounded-full mx-auto border-4 border-white shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-white opacity-30 blur-2xl"></div>
          </div>
        )}
        <h1 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
          {profile.name || 'Anonymous'}
        </h1>
        {profile.title && (
          <p className="text-2xl font-bold text-white/90 mb-4">{profile.title}</p>
        )}
        {profile.bio && (
          <p className="text-white/90 max-w-xl mx-auto text-lg leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>

      {(profile.email || profile.phone || profile.website) && (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 transition-colors border border-white/30"
            >
              📧 {profile.email}
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 transition-colors border border-white/30"
            >
              🌐 {profile.website.replace(/^https?:\/\//, '')}
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
            className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Twitter
          </a>
        )}
        {profile.github && (
          <a
            href={getSocialUrl('github', profile.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            GitHub
          </a>
        )}
        {profile.linkedin && (
          <a
            href={getSocialUrl('linkedin', profile.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            LinkedIn
          </a>
        )}
        {profile.instagram && (
          <a
            href={getSocialUrl('instagram', profile.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            Instagram
          </a>
        )}
        {profile.customLinks?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg border border-white/30"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

