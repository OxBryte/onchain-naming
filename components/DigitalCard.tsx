'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { TemplateName } from '@/lib/templates';
import { MinimalTemplate } from './card-templates/MinimalTemplate';
import { CorporateTemplate } from './card-templates/CorporateTemplate';
import { CreativeTemplate } from './card-templates/CreativeTemplate';
import { DarkTemplate } from './card-templates/DarkTemplate';
import { GradientTemplate } from './card-templates/GradientTemplate';
import { Profile } from './card-templates/types';

interface DigitalCardProps {
  profile: Profile;
  cardUrl?: string;
}

export default function DigitalCard({ profile, cardUrl }: DigitalCardProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const templateName = (profile.template as TemplateName) || 'minimal';

  useEffect(() => {
    if (cardUrl) {
      QRCode.toDataURL(cardUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCode(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [cardUrl]);

  const renderTemplate = () => {
    const templateProps = { profile, cardUrl };
    
    switch (templateName) {
      case 'corporate':
        return <CorporateTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'dark':
        return <DarkTemplate {...templateProps} />;
      case 'gradient':
        return <GradientTemplate {...templateProps} />;
      default:
        return <MinimalTemplate {...templateProps} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderTemplate()}
      {/* QR Code - shown below all templates */}
      {qrCode && (
        <div className="flex justify-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Scan to share
            </p>
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
