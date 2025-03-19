
// Main data types
export interface Lecturer {
  id: string;
  name: string;
  maxCoursesPerPeriod: number;
  availablePeriods: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  availablePeriods: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturerId: string;
  requiredRoomCapacity: number;
}

export interface StudentRequest {
  id: string;
  studentId: string;
  studentName: string;
  period: string;
  courseChoices: string[]; // Course IDs in order of preference
}

export interface MatchResult {
  studentId: string;
  studentName: string;
  assignedCourseId: string | null;
  period: string;
  satisfied: boolean;
}

// Validation and Analysis types
export interface ValidationError {
  type: 'lecturer' | 'room' | 'course' | 'request' | 'system';
  id: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface DataStatistics {
  totalStudents: number;
  totalRequests: number;
  totalCourses: number;
  totalLecturers: number;
  totalRooms: number;
  periodsInUse: string[];
  requestsPerPeriod: Record<string, number>;
  coursesPerLecturer: Record<string, number>;
  requestsPerCourse: Record<string, number>;
  roomUtilization: Record<string, number>;
}

export interface DatasetAnalysis {
  insights: string[];
  statistics: DataStatistics;
  validation: ValidationResult;
}

export interface DatasetExport {
  lecturers: Lecturer[];
  rooms: Room[];
  courses: Course[];
  requests: StudentRequest[];
  analysis: DatasetAnalysis;
}
