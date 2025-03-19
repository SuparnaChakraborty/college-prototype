
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lecturers, rooms, courses, studentRequests } from '@/utils/data';
import { analyzeDataset } from '@/utils/validation';
import { downloadDatasetAsJson } from '@/utils/dataExport';
import DataAnalysisDisplay from '@/components/DataAnalysisDisplay';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DatasetAnalysis } from '@/utils/types';
import { motion } from 'framer-motion';
import { FileJson, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DataValidator = () => {
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = () => {
    setIsLoading(true);
    
    // Simulate a processing delay for better UX
    setTimeout(() => {
      const result = analyzeDataset(lecturers, rooms, courses, studentRequests);
      setAnalysis(result);
      setIsLoading(false);
      
      if (result.validation.valid) {
        toast({
          title: "Validation Successful",
          description: "Your dataset is valid and ready for export.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Validation Issues Found",
          description: `${result.validation.errors.length} errors and ${result.validation.warnings.length} warnings detected.`,
          variant: "destructive",
          duration: 5000,
        });
      }
    }, 1000);
  };

  const handleExport = () => {
    downloadDatasetAsJson(lecturers, rooms, courses, studentRequests);
    toast({
      title: "Export Successful",
      description: "Dataset has been downloaded as JSON file.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="data">Dataset Preview</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysis}>Analysis Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lecturers Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-md overflow-hidden"
            >
              <div className="bg-primary/5 p-3 border-b">
                <h3 className="font-semibold">Lecturers ({lecturers.length})</h3>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Max Courses</TableHead>
                      <TableHead>Available Periods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturers.map(lecturer => (
                      <TableRow key={lecturer.id}>
                        <TableCell>{lecturer.name}</TableCell>
                        <TableCell>{lecturer.maxCoursesPerPeriod}</TableCell>
                        <TableCell>{lecturer.availablePeriods.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
            
            {/* Rooms Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border rounded-md overflow-hidden"
            >
              <div className="bg-primary/5 p-3 border-b">
                <h3 className="font-semibold">Rooms ({rooms.length})</h3>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Available Periods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map(room => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>{room.availablePeriods.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
            
            {/* Courses Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="border rounded-md overflow-hidden"
            >
              <div className="bg-primary/5 p-3 border-b">
                <h3 className="font-semibold">Courses ({courses.length})</h3>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Lecturer ID</TableHead>
                      <TableHead>Required Capacity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.lecturerId}</TableCell>
                        <TableCell>{course.requiredRoomCapacity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
            
            {/* Student Requests Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border rounded-md overflow-hidden"
            >
              <div className="bg-primary/5 p-3 border-b">
                <h3 className="font-semibold">Student Requests ({studentRequests.length})</h3>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Course Choices</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell>{request.studentName}</TableCell>
                        <TableCell>{request.period}</TableCell>
                        <TableCell>{request.courseChoices.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={runAnalysis} 
              className="min-w-40"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center">
                  <FileJson className="mr-2 h-4 w-4" />
                  Run Validation & Analysis
                </span>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          {analysis && (
            <DataAnalysisDisplay 
              analysis={analysis} 
              onExport={handleExport} 
            />
          )}
        </TabsContent>
      </Tabs>
      
      {analysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-50 border border-green-200 rounded-md mt-8"
        >
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Ready for Course Matching</h3>
              <p className="text-sm text-green-700 mt-1">
                Your dataset has been analyzed and is ready for course matching. You can now export 
                the data as JSON and use it in the Course Matcher.
              </p>
              <div className="mt-4">
                <Button variant="outline" onClick={handleExport} className="text-green-700 border-green-300 hover:bg-green-100">
                  <FileJson className="mr-2 h-4 w-4" />
                  Export Clean Dataset
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataValidator;
