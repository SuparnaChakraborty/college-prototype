
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CourseCard from '@/components/CourseCard';
import DataGrid from '@/components/DataGrid';
import { courses, lecturers } from '@/utils/data';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lecturerFilter, setLecturerFilter] = useState('all');
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLecturer = lecturerFilter === 'all' || course.lecturerId === lecturerFilter;
    
    return matchesSearch && matchesLecturer;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero title="Course Catalog" subtitle="Browse all available courses and their details" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card p-6 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={lecturerFilter} onValueChange={setLecturerFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by lecturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lecturers</SelectItem>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setLecturerFilter('all');
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </motion.div>
        
        {filteredCourses.length > 0 ? (
          <DataGrid
            data={filteredCourses}
            renderItem={(course) => <CourseCard course={course} />}
            columns={3}
            gap={6}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground">No courses found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setLecturerFilter('all');
              }}
            >
              Reset filters
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Courses;
