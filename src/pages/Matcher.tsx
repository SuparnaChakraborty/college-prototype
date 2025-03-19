import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { performMatching, getCourseById, getLecturerById, getRoomById } from '@/utils/data';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Users, BookOpen, School } from 'lucide-react';

const Matcher = () => {
  const [matchResults, setMatchResults] = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runMatching = () => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const results = performMatching();
      setMatchResults(results);
      
      // Set active tab to first period
      if (Object.keys(results).length > 0) {
        setActiveTab(Object.keys(results)[0]);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  // Calculate satisfaction rate for a period
  const calculateSatisfactionRate = (periodResults: any) => {
    const totalStudents = Object.keys(periodResults.assignments).length;
    const satisfiedStudents = Object.values(periodResults.assignments).filter(
      (assignment: any) => assignment.satisfied
    ).length;
    
    return totalStudents > 0 ? (satisfiedStudents / totalStudents) * 100 : 0;
  };

  // Calculate preference distribution
  const calculatePreferenceDistribution = (periodResults: any) => {
    const distribution = { 1: 0, 2: 0, 3: 0, unmatched: 0 };
    
    Object.values(periodResults.assignments).forEach((assignment: any) => {
      if (!assignment.satisfied) {
        distribution.unmatched++;
      } else if (assignment.preference) {
        distribution[assignment.preference as 1 | 2 | 3]++;
      }
    });
    
    return distribution;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Course Matcher</h1>
        
        {!matchResults ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Run Course Matching Algorithm</CardTitle>
                <CardDescription>
                  Match students to courses based on their preferences, room availability, and lecturer constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/5 p-4 rounded-lg flex flex-col items-center text-center">
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Student Preferences</h3>
                    <p className="text-sm text-muted-foreground">Prioritizes student course choices</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg flex flex-col items-center text-center">
                    <BookOpen className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Course Constraints</h3>
                    <p className="text-sm text-muted-foreground">Respects room capacity requirements</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg flex flex-col items-center text-center">
                    <School className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Lecturer Availability</h3>
                    <p className="text-sm text-muted-foreground">Considers lecturer period constraints</p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={runMatching} 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running Matcher...
                      </span>
                    ) : (
                      "Run Course Matcher"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Matching Results</h2>
              <p className="text-muted-foreground">
                Results are organized by period. Select a period tab to view detailed assignments.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                {Object.keys(matchResults).map((period) => (
                  <TabsTrigger key={period} value={period}>
                    Period {period}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(matchResults).map(([period, results]) => {
                const periodResults = results as Record<string, any>;
                const satisfactionRate = calculateSatisfactionRate(periodResults);
                const preferenceDistribution = calculatePreferenceDistribution(periodResults);
                
                return (
                  <TabsContent key={period} value={period} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Satisfaction Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="mr-2">
                              {satisfactionRate >= 80 ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-2xl font-bold">
                              {satisfactionRate.toFixed(1)}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">First Choice</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">
                              {preferenceDistribution[1]}
                            </div>
                            <div className="ml-2 text-muted-foreground">
                              students
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Second Choice</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">
                              {preferenceDistribution[2]}
                            </div>
                            <div className="ml-2 text-muted-foreground">
                              students
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Third Choice</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">
                              {preferenceDistribution[3]}
                            </div>
                            <div className="ml-2 text-muted-foreground">
                              students
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Assignments</CardTitle>
                        <CardDescription>
                          Showing all student assignments for Period {period}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
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
                            {Object.entries(periodResults.assignments).map(([studentId, data]) => {
                              const assignment = data as Record<string, any>;
                              const course = assignment.courseId ? getCourseById(assignment.courseId) : null;
                              
                              return (
                                <TableRow key={studentId}>
                                  <TableCell className="font-medium">{assignment.studentName}</TableCell>
                                  <TableCell>
                                    {course ? (
                                      <div>
                                        <div>{course.name}</div>
                                        <div className="text-xs text-muted-foreground">{course.code}</div>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground italic">Unassigned</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {assignment.preference ? (
                                      <Badge variant="outline">
                                        Choice {assignment.preference}
                                      </Badge>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {assignment.satisfied ? (
                                      <Badge className="bg-green-500 hover:bg-green-600">Satisfied</Badge>
                                    ) : (
                                      <Badge variant="destructive">Unsatisfied</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Course Enrollments</CardTitle>
                          <CardDescription>
                            Number of students assigned to each course
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Enrollment</TableHead>
                                <TableHead>Lecturer</TableHead>
                                <TableHead>Room</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(periodResults.courseEnrollments)
                                .filter(([_, count]) => (count as number) > 0)
                                .map(([courseId, count]) => {
                                  const course = getCourseById(courseId);
                                  const lecturer = course ? getLecturerById(course.lecturerId) : null;
                                  const roomId = periodResults.roomAssignments[courseId];
                                  const room = roomId ? getRoomById(roomId) : null;
                                  
                                  return (
                                    <TableRow key={courseId}>
                                      <TableCell>
                                        {course ? (
                                          <div>
                                            <div className="font-medium">{course.name}</div>
                                            <div className="text-xs text-muted-foreground">{course.code}</div>
                                          </div>
                                        ) : courseId}
                                      </TableCell>
                                      <TableCell>{count}</TableCell>
                                      <TableCell>{lecturer ? lecturer.name : '-'}</TableCell>
                                      <TableCell>{room ? room.name : '-'}</TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Lecturer Assignments</CardTitle>
                          <CardDescription>
                            Number of courses assigned to each lecturer
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Lecturer</TableHead>
                                <TableHead>Courses</TableHead>
                                <TableHead>Max Load</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(periodResults.lecturerAssignments).map(([lecturerId, count]) => {
                                const lecturer = getLecturerById(lecturerId);
                                if (!lecturer) return null;
                                
                                const isOverloaded = (count as number) > lecturer.maxCoursesPerPeriod;
                                
                                return (
                                  <TableRow key={lecturerId}>
                                    <TableCell className="font-medium">{lecturer.name}</TableCell>
                                    <TableCell>{count}</TableCell>
                                    <TableCell>{lecturer.maxCoursesPerPeriod}</TableCell>
                                    <TableCell>
                                      {isOverloaded ? (
                                        <Badge variant="destructive">Overloaded</Badge>
                                      ) : (count as number) === lecturer.maxCoursesPerPeriod ? (
                                        <Badge variant="outline">Full Load</Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Available</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setMatchResults(null)}>
                Reset and Run Again
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Matcher;
