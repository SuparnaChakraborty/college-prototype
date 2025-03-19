
import { 
  Lecturer, 
  Room, 
  Course, 
  StudentRequest, 
  ValidationResult, 
  ValidationError,
  DatasetAnalysis,
  DataStatistics
} from './types';

/**
 * Validates the entire dataset for consistency and completeness
 */
export function validateDataset(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Check for lecturers
  if (lecturers.length === 0) {
    errors.push({
      type: 'system',
      id: 'no-lecturers',
      message: 'No lecturers defined in the dataset.',
      severity: 'error'
    });
  }
  
  // Check for rooms
  if (rooms.length === 0) {
    errors.push({
      type: 'system',
      id: 'no-rooms',
      message: 'No rooms defined in the dataset.',
      severity: 'error'
    });
  }
  
  // Check for courses
  if (courses.length === 0) {
    errors.push({
      type: 'system',
      id: 'no-courses',
      message: 'No courses defined in the dataset.',
      severity: 'error'
    });
  }
  
  // Check for requests
  if (requests.length === 0) {
    errors.push({
      type: 'system',
      id: 'no-requests',
      message: 'No student requests defined in the dataset.',
      severity: 'error'
    });
  }
  
  // Course validation: check lecturer exists
  courses.forEach(course => {
    const lecturer = lecturers.find(l => l.id === course.lecturerId);
    if (!lecturer) {
      errors.push({
        type: 'course',
        id: course.id,
        message: `Course ${course.code} (${course.name}) references non-existent lecturer ID: ${course.lecturerId}.`,
        severity: 'error'
      });
    }
  });
  
  // Room capacity vs course requirements
  courses.forEach(course => {
    const suitableRooms = rooms.filter(room => room.capacity >= course.requiredRoomCapacity);
    if (suitableRooms.length === 0) {
      errors.push({
        type: 'course',
        id: course.id,
        message: `Course ${course.code} requires room capacity of ${course.requiredRoomCapacity}, but no suitable rooms exist.`,
        severity: 'error'
      });
    }
  });
  
  // Student requests validation
  requests.forEach(request => {
    // Check if referenced courses exist
    request.courseChoices.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        errors.push({
          type: 'request',
          id: request.id,
          message: `Student request for ${request.studentName} references non-existent course ID: ${courseId}.`,
          severity: 'error'
        });
      }
    });
    
    // Check if student has enough choices
    if (request.courseChoices.length === 0) {
      errors.push({
        type: 'request',
        id: request.id,
        message: `Student ${request.studentName} has no course choices for period ${request.period}.`,
        severity: 'error'
      });
    } else if (request.courseChoices.length < 3) {
      warnings.push({
        type: 'request',
        id: request.id,
        message: `Student ${request.studentName} has fewer than 3 course choices (${request.courseChoices.length}) for period ${request.period}.`,
        severity: 'warning'
      });
    }
    
    // Check for duplicate choices
    const uniqueChoices = new Set(request.courseChoices);
    if (uniqueChoices.size !== request.courseChoices.length) {
      warnings.push({
        type: 'request',
        id: request.id,
        message: `Student ${request.studentName} has duplicate course choices for period ${request.period}.`,
        severity: 'warning'
      });
    }
  });
  
  // Check for lecturer availability in periods
  const allPeriods = new Set<string>();
  requests.forEach(request => allPeriods.add(request.period));
  
  lecturers.forEach(lecturer => {
    allPeriods.forEach(period => {
      if (!lecturer.availablePeriods.includes(period)) {
        const lecturerCourses = courses.filter(c => c.lecturerId === lecturer.id);
        // Only warn if this lecturer teaches courses that students have requested
        const hasRequestedCourses = requests.some(r => 
          r.period === period && 
          r.courseChoices.some(courseId => 
            lecturerCourses.some(c => c.id === courseId)
          )
        );
        
        if (hasRequestedCourses) {
          warnings.push({
            type: 'lecturer',
            id: lecturer.id,
            message: `Lecturer ${lecturer.name} is not available in period ${period}, but teaches courses requested during this period.`,
            severity: 'warning'
          });
        }
      }
    });
  });
  
  // Check for room availability in periods
  rooms.forEach(room => {
    allPeriods.forEach(period => {
      if (!room.availablePeriods.includes(period)) {
        warnings.push({
          type: 'room',
          id: room.id,
          message: `Room ${room.name} is not available in period ${period}.`,
          severity: 'warning'
        });
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Analyzes the dataset to provide insights and statistics
 */
export function analyzeDataset(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[]
): DatasetAnalysis {
  // Collect all unique periods
  const periodsInUse = Array.from(new Set(requests.map(r => r.period))).sort();
  
  // Count requests per period
  const requestsPerPeriod: Record<string, number> = {};
  periodsInUse.forEach(period => {
    requestsPerPeriod[period] = requests.filter(r => r.period === period).length;
  });
  
  // Count courses per lecturer
  const coursesPerLecturer: Record<string, number> = {};
  lecturers.forEach(lecturer => {
    coursesPerLecturer[lecturer.id] = courses.filter(c => c.lecturerId === lecturer.id).length;
  });
  
  // Count requests per course
  const requestsPerCourse: Record<string, number> = {};
  courses.forEach(course => {
    requestsPerCourse[course.id] = requests.filter(r => 
      r.courseChoices.includes(course.id)
    ).length;
  });
  
  // Calculate potential room utilization
  const roomUtilization: Record<string, number> = {};
  rooms.forEach(room => {
    const suitableCourses = courses.filter(c => c.requiredRoomCapacity <= room.capacity);
    roomUtilization[room.id] = suitableCourses.length;
  });
  
  // Get unique student count
  const uniqueStudentIds = new Set(requests.map(r => r.studentId));
  
  // Generate insights
  const insights: string[] = [];
  
  // Insight: Course popularity
  const popularCourses = Object.entries(requestsPerCourse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([courseId, count]) => {
      const course = courses.find(c => c.id === courseId);
      return { id: courseId, name: course?.name, code: course?.code, count };
    });
  
  if (popularCourses.length > 0) {
    insights.push(`Most popular courses: ${popularCourses.map(c => `${c.code} (${c.count} requests)`).join(', ')}.`);
  }
  
  // Insight: Periods with highest demand
  const busyPeriods = Object.entries(requestsPerPeriod)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([period, count]) => ({ period, count }));
  
  if (busyPeriods.length > 0) {
    insights.push(`Highest demand periods: ${busyPeriods.map(p => `${p.period} (${p.count} requests)`).join(', ')}.`);
  }
  
  // Insight: Lecturers with most courses
  const busyLecturers = Object.entries(coursesPerLecturer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([lecturerId, count]) => {
      const lecturer = lecturers.find(l => l.id === lecturerId);
      return { id: lecturerId, name: lecturer?.name, count };
    });
  
  if (busyLecturers.length > 0) {
    insights.push(`Lecturers with most courses: ${busyLecturers.map(l => `${l.name} (${l.count} courses)`).join(', ')}.`);
  }
  
  // Insight: Room utilization
  const underutilizedRooms = Object.entries(roomUtilization)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([roomId, count]) => {
      const room = rooms.find(r => r.id === roomId);
      return { id: roomId, name: room?.name, capacity: room?.capacity, count };
    });
  
  if (underutilizedRooms.some(r => r.count === 0)) {
    insights.push(`Some rooms have no suitable courses: ${underutilizedRooms.filter(r => r.count === 0).map(r => r.name).join(', ')}.`);
  }
  
  // Check potential scheduling conflicts
  const potentialConflicts: Record<string, number> = {};
  periodsInUse.forEach(period => {
    const periodRequests = requests.filter(r => r.period === period);
    const availableLecturers = lecturers.filter(l => l.availablePeriods.includes(period));
    
    const requestedCourseIds = new Set<string>();
    periodRequests.forEach(r => r.courseChoices.forEach(c => requestedCourseIds.add(c)));
    
    const requestedCourses = courses.filter(c => requestedCourseIds.has(c.id));
    const requiredLecturerIds = new Set(requestedCourses.map(c => c.lecturerId));
    
    const availableLecturerIds = new Set(availableLecturers.map(l => l.id));
    
    // Check if all required lecturers are available
    let missingLecturers = 0;
    requiredLecturerIds.forEach(id => {
      if (!availableLecturerIds.has(id)) {
        missingLecturers++;
      }
    });
    
    if (missingLecturers > 0) {
      potentialConflicts[period] = missingLecturers;
    }
  });
  
  if (Object.keys(potentialConflicts).length > 0) {
    insights.push(`Potential scheduling conflicts in periods: ${Object.entries(potentialConflicts)
      .map(([period, count]) => `${period} (${count} missing lecturers)`)
      .join(', ')}.`);
  }
  
  // Recommendations based on analysis
  if (requests.some(r => r.courseChoices.length < 3)) {
    insights.push("Recommendation: Encourage students to provide at least 3 course preferences to increase matching flexibility.");
  }
  
  const statistics: DataStatistics = {
    totalStudents: uniqueStudentIds.size,
    totalRequests: requests.length,
    totalCourses: courses.length,
    totalLecturers: lecturers.length,
    totalRooms: rooms.length,
    periodsInUse,
    requestsPerPeriod,
    coursesPerLecturer,
    requestsPerCourse,
    roomUtilization
  };
  
  // Get validation results
  const validation = validateDataset(lecturers, rooms, courses, requests);
  
  return {
    insights,
    statistics,
    validation
  };
}
