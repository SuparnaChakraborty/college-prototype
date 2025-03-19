
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, PauseCircle, BarChart3, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LoadingSpinner from '@/components/LoadingSpinner';
import { performMatching, courses, getCourseById } from '@/utils/data';
import { cn } from '@/lib/utils';

const Matcher = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  
  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    
    // Simulate progress over time
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        const newProgress = prev + (Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setResults(performMatching());
            setIsSimulating(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero title="Course Matcher" subtitle="Visualize our algorithm in action" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card p-6 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Matching Algorithm Visualization</h2>
              <p className="text-sm text-muted-foreground">
                See how our algorithm matches students with courses while optimizing for preferences and constraints
              </p>
            </div>
            
            <Button 
              onClick={runSimulation}
              disabled={isSimulating}
              size="lg"
              className="gap-2"
            >
              {isSimulating ? <PauseCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
          
          {isSimulating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Matching in progress...
              </p>
              <Progress value={simulationProgress} className="h-2" />
            </motion.div>
          )}
        </motion.div>
        
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab} className="mb-8">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="students" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Students</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Courses</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats cards */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Satisfaction Rate</h3>
                      
                      <div className="space-y-6">
                        {Object.entries(results).map(([period, periodData]: [string, any]) => {
                          const assignments = Object.values(periodData.assignments);
                          const satisfiedCount = assignments.filter((a: any) => a.satisfied).length;
                          const percent = Math.round((satisfiedCount / assignments.length) * 100);
                          
                          return (
                            <div key={period} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Period {period}</span>
                                <span className="font-medium">{percent}%</span>
                              </div>
                              <Progress value={percent} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Preference Distribution</h3>
                      
                      <div className="space-y-6">
                        {[1, 2, 3].map(preference => {
                          let count = 0;
                          let total = 0;
                          
                          Object.values(results).forEach((periodData: any) => {
                            Object.values(periodData.assignments).forEach((assignment: any) => {
                              if (assignment.satisfied) {
                                total++;
                                if (assignment.preference === preference) {
                                  count++;
                                }
                              }
                            });
                          });
                          
                          const percent = total ? Math.round((count / total) * 100) : 0;
                          
                          return (
                            <div key={preference} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Preference {preference}</span>
                                <span className="font-medium">{percent}%</span>
                              </div>
                              <Progress value={percent} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="students">
                  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {Object.entries(results).map(([period, periodData]: [string, any]) => (
                        <div key={period} className="p-4">
                          <h3 className="text-lg font-semibold mb-4">Period {period} Assignments</h3>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="px-4 py-3 text-left font-medium">Student</th>
                                  <th className="px-4 py-3 text-left font-medium">Assigned Course</th>
                                  <th className="px-4 py-3 text-left font-medium">Preference</th>
                                  <th className="px-4 py-3 text-left font-medium">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(periodData.assignments).map(([studentId, data]: [string, any]) => (
                                  <tr key={studentId} className="border-b">
                                    <td className="px-4 py-3 font-medium">{data.studentName}</td>
                                    <td className="px-4 py-3">{data.courseName || "Not assigned"}</td>
                                    <td className="px-4 py-3">
                                      {data.preference ? (
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                                          Choice {data.preference}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
                                          N/A
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={cn(
                                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                        data.satisfied 
                                          ? "bg-green-50 text-green-700 ring-green-700/10" 
                                          : "bg-red-50 text-red-700 ring-red-700/10"
                                      )}>
                                        {data.satisfied ? "Satisfied" : "Unsatisfied"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="courses">
                  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {Object.entries(results).map(([period, periodData]: [string, any]) => (
                        <div key={period} className="p-4">
                          <h3 className="text-lg font-semibold mb-4">Period {period} Course Enrollments</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(periodData.courseEnrollments)
                              .filter(([_, count]) => count > 0)
                              .map(([courseId, count]) => {
                                const course = getCourseById(courseId);
                                if (!course) return null;
                                
                                return (
                                  <div key={courseId} className="p-4 rounded-lg border">
                                    <div className="text-xs font-medium text-primary mb-1">{course.code}</div>
                                    <div className="font-semibold mb-2">{course.name}</div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Enrollment:</span>
                                      <span className="text-sm font-medium">{count} students</span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          
                          {Object.values(periodData.courseEnrollments).every(count => count === 0) && (
                            <p className="text-center text-muted-foreground py-4">No courses assigned for this period</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              {isSimulating ? (
                <div>
                  <LoadingSpinner size="lg" className="mx-auto mb-6" />
                  <h3 className="text-lg font-medium mb-2">Running matching algorithm...</h3>
                  <p className="text-muted-foreground">
                    Optimizing assignments based on preferences and constraints
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to run simulation</h3>
                  <p className="text-muted-foreground">
                    Click the "Run Simulation" button to start the matching process
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Matcher;
