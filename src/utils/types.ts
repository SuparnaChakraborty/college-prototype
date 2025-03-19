
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

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface DatasetAnalysis {
  insights: string[];
  statistics: Record<string, any>;
  validation: ValidationResult;
}

export interface DatasetExport {
  lecturers: Lecturer[];
  rooms: Room[];
  courses: Course[];
  requests: StudentRequest[];
  analysis: DatasetAnalysis;
}
