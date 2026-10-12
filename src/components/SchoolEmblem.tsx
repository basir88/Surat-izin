import React, { useState } from 'react';
import { LOGO_SEKOLAH_URL, LOGO_SEKOLAH_PATH, LOGO_SEKOLAH_BASE64 } from '../assets/logoBase64';

interface SchoolEmblemProps {
  className?: string;
  size?: number;
}

export const SchoolEmblem: React.FC<SchoolEmblemProps> = ({
  className = '',
  size = 48,
}) => {
  // Use the direct URL provided by the user (https://iili.io/qKjd2YN.png) as primary source
  const [currentSrc, setCurrentSrc] = useState<string>(LOGO_SEKOLAH_URL);

  return (
    <img
      src={currentSrc}
      onError={() => {
        if (currentSrc === LOGO_SEKOLAH_URL) {
          // Fallback to local downloaded PNG asset
          setCurrentSrc(LOGO_SEKOLAH_PATH);
        } else if (currentSrc === LOGO_SEKOLAH_PATH) {
          // Fallback to embedded base64 data URI
          setCurrentSrc(LOGO_SEKOLAH_BASE64);
        }
      }}
      alt="Logo SDN 004 Sebatik Tengah"
      width={size}
      height={size}
      className={`shrink-0 object-contain select-none block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        aspectRatio: '1/1',
      }}
      loading="eager"
      decoding="async"
    />
  );
};
