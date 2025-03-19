
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lecturer, Room, Course, StudentRequest, ValidationResult, DatasetAnalysis } from '@/utils/types';
import { validateDataset, analyzeDataset } from '@/utils/validation';
import { downloadDatasetAsJson } from '@/utils/dataExport';
import { lecturers, rooms, courses, studentRequests } from '@/utils/data';

const DataValidator = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  
  const handleValidate = () => {
    const result = validateDataset(lecturers, rooms, courses, studentRequests);
    setValidationResult(result);
    
    if (result.valid) {
      const analysisResult = analyzeDataset(lecturers, rooms, courses, studentRequests);
      setAnalysis({
        ...analysisResult,
        validation: result
      });
    }
  };
  
  const handleExportJson = () => {
    downloadDatasetAsJson(lecturers, rooms, courses, studentRequests);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Validation & Analysis</CardTitle>
          <CardDescription>
            Validate the course matching dataset and analyze the results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <h3 className="text-2xl font-bold">{lecturers.length}</h3>
                <p className="text-sm text-muted-foreground">Lecturers</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <h3 className="text-2xl font-bold">{rooms.length}</h3>
                <p className="text-sm text-muted-foreground">Rooms</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <h3 className="text-2xl font-bold">{courses.length}</h3>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <h3 className="text-2xl font-bold">{studentRequests.length}</h3>
                <p className="text-sm text-muted-foreground">Student Requests</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {validationResult && !validationResult.valid && (
              <Alert variant="destructive">
                <AlertTitle>Validation Failed</AlertTitle>
                <AlertDescription>
                  <p>Found {validationResult.errors.length} errors in the dataset:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {validationResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {validationResult.errors.length > 5 && (
                      <li>...and {validationResult.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult && validationResult.valid && (
              <Alert>
                <AlertTitle>Validation Successful</AlertTitle>
                <AlertDescription>
                  The dataset is valid and ready for analysis.
                </AlertDescription>
              </Alert>
            )}
            
            {analysis && (
              <Tabs defaultValue="insights">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  <TabsTrigger value="constraints">Constraints</TabsTrigger>
                </TabsList>
                <TabsContent value="insights" className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                  <ul className="space-y-2">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="flex">
                        <span className="mr-2">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="statistics" className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Dataset Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysis.statistics)
                      .filter(([key]) => !key.includes('Distribution') && typeof analysis.statistics[key] !== 'object')
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="constraints" className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-2">Constraint Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on the dataset constraints and matching rules
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p><strong>Lecturer Constraints:</strong> Each lecturer can teach up to their maximum courses per period</p>
                    </div>
                    <div>
                      <p><strong>Room Constraints:</strong> Room capacity must meet course requirements</p>
                    </div>
                    <div>
                      <p><strong>Schedule Constraints:</strong> Courses can only be offered in periods where both lecturer and room are available</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleValidate}>Validate & Analyze Data</Button>
          <Button variant="outline" onClick={handleExportJson}>Export JSON</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataValidator;
