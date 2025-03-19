
import { Lecturer, Room, Course, StudentRequest, DatasetExport } from './types';
import { validateDataset, analyzeDataset } from './validation';

/**
 * Prepares data for export to JSON
 */
export function prepareDatasetForExport(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[]
): DatasetExport {
  const validation = validateDataset(lecturers, rooms, courses, requests);
  const analysis = analyzeDataset(lecturers, rooms, courses, requests);
  
  return {
    lecturers,
    rooms,
    courses,
    requests,
    analysis
  };
}

/**
 * Exports dataset to JSON string
 */
export function exportDatasetToJson(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[]
): string {
  const dataset = prepareDatasetForExport(lecturers, rooms, courses, requests);
  return JSON.stringify(dataset, null, 2);
}

/**
 * Downloads dataset as JSON file
 */
export function downloadDatasetAsJson(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[],
  filename: string = 'course-matcher-data.json'
): void {
  const jsonStr = exportDatasetToJson(lecturers, rooms, courses, requests);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}
