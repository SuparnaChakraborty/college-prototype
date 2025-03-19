
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const circleSize = {
    sm: 1,
    md: 2,
    lg: 3
  };
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div 
        className={cn('relative', sizeClasses[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: circleSize[size],
              height: circleSize[size],
              x: '-50%',
              y: '-50%',
            }}
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0.8 - (i * 0.2),
              scale: 1 - (i * 0.2)
            }}
            animate={{
              x: [0, 0, 0],
              y: [0, -10, 0],
              opacity: [0.8 - (i * 0.2), 0.2, 0.8 - (i * 0.2)],
              scale: [1 - (i * 0.2), 1, 1 - (i * 0.2)]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
