import { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

const Logo: FC<LogoProps> = ({ size = 'md', dark = false }) => {
  const scales = { sm: 0.7, md: 1, lg: 1.5 };
  const s   = scales[size];
  const uid = `yl-${dark ? 'd' : 'l'}-${size}`;

  return (
    <svg
      width={Math.round(210 * s)}
      height={Math.round(52 * s)}
      viewBox="0 0 210 52"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YOUM'S Marketplace"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF7A4E"/>
          <stop offset="100%" stopColor="#C93B1A"/>
        </linearGradient>
        <linearGradient id={`${uid}-hl`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>

      {/* Badge */}
      <rect x="0" y="2" width="50" height="48" rx="14" fill={`url(#${uid}-bg)`}/>
      <rect x="0" y="2" width="50" height="28" rx="14" fill={`url(#${uid}-hl)`}/>

      {/* Y */}
      <line x1="12" y1="12" x2="25" y2="28" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <line x1="38" y1="12" x2="25" y2="28" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <line x1="25" y1="28" x2="25" y2="42" stroke="white" strokeWidth="6" strokeLinecap="round"/>

      {/* Wordmark */}
      <text x="62" y="34"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontSize="28" fontWeight="800" letterSpacing="-1.5"
        fill={dark ? '#fff' : '#1A1714'}>YOUM</text>

      <text x="149" y="34"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontSize="28" fontWeight="800"
        fill="#E8553A">'S</text>

      {/* Orange rule */}
      <rect x="62" y="39" width="110" height="1.5" rx="1"
        fill={dark ? 'rgba(232,85,58,0.55)' : 'rgba(232,85,58,0.35)'}/>

      {/* Tagline */}
      <text x="63" y="50"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontSize="7.5" fontWeight="600" letterSpacing="4"
        fill={dark ? 'rgba(255,255,255,0.38)' : '#C0B8B0'}>MARKETPLACE</text>
    </svg>
  );
};

export default Logo;
