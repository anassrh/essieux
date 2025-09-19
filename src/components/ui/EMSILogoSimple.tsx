interface EMSILogoSimpleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EMSILogoSimple({ size = 'md', className = '' }: EMSILogoSimpleProps) {
  const sizeClasses = {
    sm: 'w-32 h-16',
    md: 'w-48 h-24',
    lg: 'w-64 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="flex items-center space-x-3">
        {/* People silhouettes */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-1.5 h-3 bg-green-500 mt-0.5"></div>
              {i === 1 && <div className="w-1 h-1.5 bg-green-500 mt-0.5"></div>}
            </div>
          ))}
        </div>
        
        {/* Red diamond */}
        <div className="w-2 h-2 bg-red-500 transform rotate-45"></div>
        
        {/* EMSI text */}
        <div className="bg-gray-700 text-white px-1.5 py-0.5 rounded text-xs font-bold">
          EMSI
        </div>
        
        {/* Main text */}
        <div className="text-green-600 text-xs font-bold leading-tight">
          <div>ECOLE MAROCAINE DES</div>
          <div>SCIENCES DE L&apos;INGENIEUR</div>
        </div>
      </div>
    </div>
  );
}
