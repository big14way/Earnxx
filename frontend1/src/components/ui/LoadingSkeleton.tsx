import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'skeleton animate-pulse';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'rounded-xl';
      default:
        return 'rounded-lg';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton layouts
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <LoadingSkeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <LoadingSkeleton variant="text" width="60%" />
        <LoadingSkeleton variant="text" width="40%" className="mt-2" />
      </div>
    </div>
    <LoadingSkeleton variant="text" lines={3} />
    <div className="flex space-x-2 mt-4">
      <LoadingSkeleton variant="rectangular" width={80} height={32} />
      <LoadingSkeleton variant="rectangular" width={100} height={32} />
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <LoadingSkeleton variant="text" width="40%" height={32} className="mb-4" />
      <LoadingSkeleton variant="text" lines={2} />
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <LoadingSkeleton variant="text" width="70%" />
          <LoadingSkeleton variant="text" width="50%" height={24} className="mt-2" />
        </div>
      ))}
    </div>
    
    {/* Cards */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const InvestmentSkeleton: React.FC = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <LoadingSkeleton variant="circular" width={40} height={40} />
            <div>
              <LoadingSkeleton variant="text" width={120} />
              <LoadingSkeleton variant="text" width={80} className="mt-1" />
            </div>
          </div>
          <div className="text-right">
            <LoadingSkeleton variant="text" width={60} height={24} />
            <LoadingSkeleton variant="text" width={40} className="mt-1" />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j}>
              <LoadingSkeleton variant="text" width="60%" />
              <LoadingSkeleton variant="text" width="80%" className="mt-1" />
            </div>
          ))}
        </div>
        
        <LoadingSkeleton variant="rectangular" width="100%" height={8} className="mb-4" />
        <LoadingSkeleton variant="rectangular" width="100%" height={48} />
      </div>
    ))}
  </div>
);