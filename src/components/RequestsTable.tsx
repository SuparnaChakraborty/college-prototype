
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StudentRequest } from '@/utils/types';
import { getCourseById } from '@/utils/data';
import { cn } from '@/lib/utils';

interface RequestsTableProps {
  requests: StudentRequest[];
  className?: string;
}

const RequestsTable = ({ requests, className }: RequestsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  return (
    <div className={cn('overflow-x-auto', className)}>
      <motion.table 
        className="w-full text-sm" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium">Student</th>
            <th className="px-4 py-3 text-left font-medium">Period</th>
            <th className="px-4 py-3 text-left font-medium">First Choice</th>
            <th className="px-4 py-3 text-left font-medium">Second Choice</th>
            <th className="px-4 py-3 text-left font-medium">Third Choice</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const isHovered = hoveredRow === request.id;
            
            return (
              <motion.tr 
                key={request.id}
                className={cn(
                  "border-b transition-colors",
                  isHovered ? "bg-primary/5" : "hover:bg-muted/50"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredRow(request.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3 font-medium">{request.studentName}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {request.period}
                  </span>
                </td>
                {request.courseChoices.slice(0, 3).map((courseId, index) => {
                  const course = getCourseById(courseId);
                  return (
                    <td key={index} className="px-4 py-3">
                      {course ? (
                        <div>
                          <div className="font-medium">{course.name}</div>
                          <div className="text-xs text-muted-foreground">{course.code}</div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  );
                })}
                {/* Add empty cells if less than 3 choices */}
                {Array(3 - request.courseChoices.length).fill(0).map((_, i) => (
                  <td key={`empty-${i}`} className="px-4 py-3">N/A</td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    </div>
  );
};

export default RequestsTable;
