
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  columns?: number;
  gap?: number;
}

function DataGrid<T>({ 
  data, 
  renderItem, 
  className, 
  itemClassName,
  columns = 3,
  gap = 6
}: DataGridProps<T>) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const gridColumnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        'grid',
        gridColumnClasses[columns as keyof typeof gridColumnClasses],
        gapClasses[gap as keyof typeof gapClasses],
        className
      )}
    >
      {data.map((item, index) => (
        <motion.div 
          key={index} 
          variants={item} 
          className={itemClassName}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default DataGrid;
