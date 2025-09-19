interface EMSILogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EMSILogo({ size = 'md', className = '' }: EMSILogoProps) {
  const sizeClasses = {
    sm: 'w-32 h-16',
    md: 'w-48 h-24',
    lg: 'w-64 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 400 120" className="w-full h-full">
        {/* Background */}
        <rect width="400" height="120" fill="white" />
        
        {/* Left side - People silhouettes */}
        <g transform="translate(20, 25)">
          {/* First person (leftmost with briefcase) */}
          <ellipse cx="8" cy="8" rx="5" ry="7" fill="#22c55e" />
          <rect x="4" y="15" width="8" height="15" fill="#22c55e" />
          <rect x="1" y="17" width="5" height="8" fill="#22c55e" rx="1" />
          
          {/* Second person */}
          <ellipse cx="22" cy="8" rx="5" ry="7" fill="#22c55e" />
          <rect x="18" y="15" width="8" height="15" fill="#22c55e" />
          <rect x="15" y="17" width="4" height="8" fill="#22c55e" />
          
          {/* Third person */}
          <ellipse cx="36" cy="8" rx="5" ry="7" fill="#22c55e" />
          <rect x="32" y="15" width="8" height="15" fill="#22c55e" />
          <rect x="29" y="17" width="4" height="8" fill="#22c55e" />
          
          {/* Fourth person */}
          <ellipse cx="50" cy="8" rx="5" ry="7" fill="#22c55e" />
          <rect x="46" y="15" width="8" height="15" fill="#22c55e" />
          <rect x="43" y="17" width="4" height="8" fill="#22c55e" />
        </g>
        
        {/* Red diamond */}
        <rect x="85" y="20" width="12" height="12" fill="#ef4444" transform="rotate(45 91 26)" />
        
        {/* EMSI box */}
        <rect x="75" y="40" width="40" height="18" fill="#374151" rx="2" />
        <text x="95" y="52" textAnchor="middle" fill="white" fontSize="9" fontFamily="serif" fontWeight="bold">EMSI</text>
        
        {/* Right side text */}
        <g transform="translate(130, 20)">
          {/* Green main text */}
          <text x="0" y="15" fill="#22c55e" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            ECOLE MAROCAINE DES
          </text>
          <text x="0" y="28" fill="#22c55e" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            SCIENCES DE L&apos;INGENIEUR
          </text>
          
          {/* Gray line */}
          <line x1="0" y1="33" x2="200" y2="33" stroke="#6b7280" strokeWidth="0.5" />
          
          {/* Gray subtitle */}
          <text x="0" y="45" fill="#6b7280" fontSize="7" fontFamily="sans-serif">
            Membre de
          </text>
          <text x="0" y="55" fill="#6b7280" fontSize="7" fontFamily="sans-serif">
            HONORIS UNITED UNIVERSITIES
          </text>
        </g>
      </svg>
    </div>
  );
}
