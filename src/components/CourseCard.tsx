
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Course, Lecturer } from '@/utils/types';
import { getLecturerForCourse } from '@/utils/data';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard = ({ course, className }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const lecturer = getLecturerForCourse(course.id);
  
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300',
        isHovered ? 'shadow-md scale-[1.02]' : '',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-primary mb-1">{course.code}</p>
            <h3 className="text-lg font-semibold tracking-tight">{course.name}</h3>
          </div>
          <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
            Cap: {course.requiredRoomCapacity}
          </div>
        </div>
        
        {lecturer && (
          <div className="mt-auto pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Lecturer:</span> {lecturer.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Available:</span> {lecturer.availablePeriods.join(', ')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;
