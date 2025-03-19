
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  lecturers, 
  rooms, 
  courses, 
  studentRequests,
  performMatching,
  getCourseById
} from '@/utils/data';
import { StudentRequest, MatchResult, Course } from '@/utils/types';

const Matcher = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [matchResults, setMatchResults] = useState<Record<string, any> | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalStudents: number;
    satisfiedStudents: number;
    satisfactionRate: number;
    preference1Count: number;
    preference2Count: number;
    preference3Count: number;
    unassignedCount: number;
  } | null>(null);

  // Get all unique periods from student requests
  const periods = Array.from(new Set(studentRequests.map(req => req.period))).sort();

  const runMatching = () => {
    setIsCalculating(true);
    
    // Simulating calculation delay
    setTimeout(() => {
      try {
        const results = performMatching();
        setMatchResults(results);
        
        // Set the first period as selected
        if (periods.length > 0 && results) {
          setSelectedPeriod(periods[0]);
          
          // Calculate overall summary
          let totalStudents = 0;
          let satisfiedStudents = 0;
          let preference1Count = 0;
          let preference2Count = 0;
          let preference3Count = 0;
          let unassignedCount = 0;
          
          Object.values(results).forEach((periodResults: any) => {
            const periodAssignments = periodResults.assignments;
            
            Object.values(periodAssignments).forEach((assignment: any) => {
              totalStudents++;
              
              if (assignment.satisfied) {
                satisfiedStudents++;
                
                if (assignment.preference === 1) preference1Count++;
                else if (assignment.preference === 2) preference2Count++;
                else if (assignment.preference === 3) preference3Count++;
              } else {
                unassignedCount++;
              }
            });
          });
          
          setSummary({
            totalStudents,
            satisfiedStudents,
            satisfactionRate: totalStudents > 0 ? (satisfiedStudents / totalStudents) * 100 : 0,
            preference1Count,
            preference2Count,
            preference3Count,
            unassignedCount
          });
        }
        
        toast({
          title: "Matching Completed",
          description: "The course matching algorithm has finished running.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error in matching algorithm:", error);
        toast({
          title: "Matching Error",
          description: "An error occurred while running the matching algorithm.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsCalculating(false);
      }
    }, 2000);
  };

  const getPreferenceLabel = (preference: number | null) => {
    if (preference === null) return null;
    
    switch(preference) {
      case 1: return <Badge className="bg-green-500">1st Choice</Badge>;
      case 2: return <Badge className="bg-blue-500">2nd Choice</Badge>;
      case 3: return <Badge className="bg-amber-500">3rd Choice</Badge>;
      default: return null;
    }
  };

  useEffect(() => {
    // Automatically run matching when component mounts
    if (!matchResults) {
      runMatching();
    }
  }, []);

  const getPeriodData = () => {
    if (!matchResults || !selectedPeriod) return null;
    return matchResults[selectedPeriod];
  };

  const periodData = getPeriodData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Course Matcher</h1>
        
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <h2 className="text-xl font-medium mt-6">Running Matching Algorithm</h2>
            <p className="text-muted-foreground mt-2">
              Optimizing course assignments based on student preferences...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.totalStudents}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Student course requests processed
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Satisfaction Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {summary.satisfactionRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Students assigned to a requested course
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        First Choice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.preference1Count}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((summary.preference1Count / summary.totalStudents) * 100).toFixed(1)}% of students got their first choice
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Unassigned
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.unassignedCount}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((summary.unassignedCount / summary.totalStudents) * 100).toFixed(1)}% of students could not be matched
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
            
            {matchResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue={selectedPeriod || ""} onValueChange={setSelectedPeriod}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Period Results</h2>
                    <TabsList>
                      {periods.map(period => (
                        <TabsTrigger key={period} value={period}>
                          Period {period}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  {periods.map(period => (
                    <TabsContent key={period} value={period}>
                      {periodData && (
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
                            <div>
                              <h3 className="text-lg font-medium">Period {period} Assignments</h3>
                              <p className="text-sm text-muted-foreground">
                                {Object.keys(periodData.assignments).length} students, {Object.keys(periodData.courseEnrollments).filter(id => periodData.courseEnrollments[id] > 0).length} active courses
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center space-x-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                                      <Check size={16} />
                                      <span>
                                        {Object.values(periodData.assignments).filter((a: any) => a.satisfied).length} matched
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Students successfully matched to a course
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center space-x-1 bg-destructive/10 text-destructive rounded-full px-3 py-1 text-sm">
                                      <AlertTriangle size={16} />
                                      <span>
                                        {Object.values(periodData.assignments).filter((a: any) => !a.satisfied).length} unmatched
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Students that could not be matched to any of their choices
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center space-x-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm">
                                      <HelpCircle size={16} />
                                      <span>
                                        {Object.values(periodData.assignments).filter((a: any) => a.preference === 1).length} first choice
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Students who got their first choice
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead>Assigned Course</TableHead>
                                  <TableHead>Preference</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(periodData.assignments).map(([studentId, data]: [string, any]) => (
                                  <TableRow key={studentId}>
                                    <TableCell className="font-medium">{data.studentName}</TableCell>
                                    <TableCell>
                                      {data.courseId ? (
                                        <>
                                          {(() => {
                                            const course = getCourseById(data.courseId);
                                            return course ? (
                                              <span>
                                                <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mr-2">
                                                  {course.code}
                                                </span>
                                                {course.name}
                                              </span>
                                            ) : data.courseName;
                                          })()}
                                        </>
                                      ) : (
                                        <span className="text-muted-foreground italic">
                                          Not assigned
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {data.preference ? getPreferenceLabel(data.preference) : "-"}
                                    </TableCell>
                                    <TableCell>
                                      {data.satisfied ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          Satisfied
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                          Unsatisfied
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
            )}
            
            <div className="flex justify-center mt-10">
              <Button 
                onClick={runMatching} 
                disabled={isCalculating}
                className="min-w-40"
              >
                {isCalculating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running Algorithm...
                  </span>
                ) : "Re-run Matching Algorithm"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Matcher;
