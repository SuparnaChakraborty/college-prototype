
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DatasetAnalysis, ValidationError } from '@/utils/types';
import { Check, AlertTriangle, AlertCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataAnalysisDisplayProps {
  analysis: DatasetAnalysis;
  onExport: () => void;
}

const DataAnalysisDisplay: React.FC<DataAnalysisDisplayProps> = ({ 
  analysis, 
  onExport 
}) => {
  const { insights, statistics, validation } = analysis;
  const { valid, errors, warnings } = validation;

  // Helper function to display period data in a readable format
  const formatPeriodData = (data: Record<string, number>) => {
    return Object.entries(data).map(([period, count]) => (
      <div key={period} className="flex items-center gap-2 mb-1">
        <Badge variant="outline">{period}</Badge>
        <span>{count}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={valid ? "border-green-500/50" : "border-red-500/50"}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>
                Overall status of your dataset
              </CardDescription>
            </div>
            <div>
              {valid ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Invalid
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {errors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-red-500">Errors ({errors.length})</h3>
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error</AlertTitle>
                      <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
            
            {warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-yellow-500">Warnings ({warnings.length})</h3>
                <div className="space-y-2">
                  {warnings.map((warning, index) => (
                    <Alert key={index} variant="default" className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <AlertTitle className="text-yellow-700">
                        {warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Warning
                      </AlertTitle>
                      <AlertDescription className="text-yellow-600">{warning.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dataset Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Insights</CardTitle>
            <CardDescription>
              Key observations and recommendations based on your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-muted-foreground">{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dataset Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Dataset Statistics</CardTitle>
            <CardDescription>
              Numerical breakdown of your dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-muted/40 p-4 rounded-md">
                <h3 className="font-medium mb-2">Overview</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-mono">{statistics.totalStudents}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Requests:</span>
                    <span className="font-mono">{statistics.totalRequests}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Courses:</span>
                    <span className="font-mono">{statistics.totalCourses}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Lecturers:</span>
                    <span className="font-mono">{statistics.totalLecturers}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Rooms:</span>
                    <span className="font-mono">{statistics.totalRooms}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Periods:</span>
                    <span className="font-mono">{statistics.periodsInUse.join(', ')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/40 p-4 rounded-md">
                <h3 className="font-medium mb-2">Requests per Period</h3>
                {formatPeriodData(statistics.requestsPerPeriod)}
              </div>

              <div className="bg-muted/40 p-4 rounded-md">
                <h3 className="font-medium mb-2">Popular Courses</h3>
                {Object.entries(statistics.requestsPerCourse)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([courseId, count]) => (
                    <div key={courseId} className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{courseId}</Badge>
                      <span>{count} requests</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Dataset as JSON
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataAnalysisDisplay;
