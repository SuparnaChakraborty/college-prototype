
import { Lecturer, Room, Course, StudentRequest, MatchResult } from './types';

/**
 * Validates if a lecturer has valid periods
 */
export function validateLecturer(lecturer: Lecturer): string[] {
  const errors: string[] = [];
  
  if (!lecturer.id) errors.push(`Lecturer is missing ID`);
  if (!lecturer.name) errors.push(`Lecturer ${lecturer.id} is missing name`);
  if (lecturer.maxCoursesPerPeriod <= 0) errors.push(`Lecturer ${lecturer.name} (${lecturer.id}) has invalid maxCoursesPerPeriod`);
  if (!lecturer.availablePeriods || lecturer.availablePeriods.length === 0) {
    errors.push(`Lecturer ${lecturer.name} (${lecturer.id}) has no available periods`);
  }
  
  return errors;
}

/**
 * Validates if a room has valid capacity and periods
 */
export function validateRoom(room: Room): string[] {
  const errors: string[] = [];
  
  if (!room.id) errors.push(`Room is missing ID`);
  if (!room.name) errors.push(`Room ${room.id} is missing name`);
  if (room.capacity <= 0) errors.push(`Room ${room.name} (${room.id}) has invalid capacity`);
  if (!room.availablePeriods || room.availablePeriods.length === 0) {
    errors.push(`Room ${room.name} (${room.id}) has no available periods`);
  }
  
  return errors;
}

/**
 * Validates if a course has a valid lecturer and room capacity requirement
 */
export function validateCourse(course: Course, lecturers: Lecturer[]): string[] {
  const errors: string[] = [];
  
  if (!course.id) errors.push(`Course is missing ID`);
  if (!course.code) errors.push(`Course ${course.id} is missing code`);
  if (!course.name) errors.push(`Course ${course.code} (${course.id}) is missing name`);
  
  if (!course.lecturerId) {
    errors.push(`Course ${course.name} (${course.id}) is missing lecturerId`);
  } else {
    const lecturer = lecturers.find(l => l.id === course.lecturerId);
    if (!lecturer) {
      errors.push(`Course ${course.name} (${course.id}) has invalid lecturerId: ${course.lecturerId}`);
    }
  }
  
  if (course.requiredRoomCapacity <= 0) {
    errors.push(`Course ${course.name} (${course.id}) has invalid requiredRoomCapacity`);
  }
  
  return errors;
}

/**
 * Validates if a student request has valid course choices
 */
export function validateStudentRequest(request: StudentRequest, courses: Course[]): string[] {
  const errors: string[] = [];
  
  if (!request.id) errors.push(`Student request is missing ID`);
  if (!request.studentId) errors.push(`Request ${request.id} is missing studentId`);
  if (!request.studentName) errors.push(`Request ${request.id} is missing studentName`);
  if (!request.period) errors.push(`Request for ${request.studentName} (${request.id}) is missing period`);
  
  if (!request.courseChoices || request.courseChoices.length === 0) {
    errors.push(`Request for ${request.studentName} (${request.id}) has no course choices`);
  } else {
    request.courseChoices.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        errors.push(`Request for ${request.studentName} has invalid course choice: ${courseId}`);
      }
    });
  }
  
  return errors;
}

/**
 * Validates the entire dataset for consistency
 */
export function validateDataset(
  lecturers: Lecturer[], 
  rooms: Room[], 
  courses: Course[], 
  requests: StudentRequest[]
): { valid: boolean; errors: string[] } {
  let errors: string[] = [];
  
  // Validate individual entities
  lecturers.forEach(lecturer => {
    errors = [...errors, ...validateLecturer(lecturer)];
  });
  
  rooms.forEach(room => {
    errors = [...errors, ...validateRoom(room)];
  });
  
  courses.forEach(course => {
    errors = [...errors, ...validateCourse(course, lecturers)];
  });
  
  requests.forEach(request => {
    errors = [...errors, ...validateStudentRequest(request, courses)];
  });
  
  // Validate matching rules
  const periods = new Set<string>();
  requests.forEach(request => periods.add(request.period));
  
  periods.forEach(period => {
    const periodRequests = requests.filter(r => r.period === period);
    const requestedCourseIds = new Set<string>();
    
    periodRequests.forEach(request => {
      request.courseChoices.forEach(courseId => {
        requestedCourseIds.add(courseId);
      });
    });
    
    // Check if courses can be offered in this period
    requestedCourseIds.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const lecturer = lecturers.find(l => l.id === course.lecturerId);
        if (lecturer && !lecturer.availablePeriods.includes(period)) {
          errors.push(`Course ${course.name} (${course.id}) is requested in period ${period}, but lecturer ${lecturer.name} is not available`);
        }
        
        // Check if there are suitable rooms
        const suitableRooms = rooms.filter(
          room => room.capacity >= course.requiredRoomCapacity && 
                  room.availablePeriods.includes(period)
        );
        
        if (suitableRooms.length === 0) {
          errors.push(`Course ${course.name} (${course.id}) requires capacity ${course.requiredRoomCapacity} in period ${period}, but no suitable rooms are available`);
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Analyzes the dataset and provides insights
 */
export function analyzeDataset(
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[],
  requests: StudentRequest[]
): { insights: string[]; statistics: Record<string, any> } {
  const insights: string[] = [];
  const statistics: Record<string, any> = {};
  
  // Count courses per lecturer
  const coursesPerLecturer: Record<string, number> = {};
  courses.forEach(course => {
    if (!coursesPerLecturer[course.lecturerId]) {
      coursesPerLecturer[course.lecturerId] = 0;
    }
    coursesPerLecturer[course.lecturerId]++;
  });
  
  // Identify overloaded lecturers
  const overloadedLecturers = lecturers.filter(
    lecturer => (coursesPerLecturer[lecturer.id] || 0) > lecturer.maxCoursesPerPeriod
  );
  
  if (overloadedLecturers.length > 0) {
    insights.push(`${overloadedLecturers.length} lecturers are potentially overloaded if all their courses are scheduled in the same period.`);
  }
  
  // Analyze room utilization
  const largeRooms = rooms.filter(room => room.capacity >= 100);
  const smallRooms = rooms.filter(room => room.capacity < 30);
  
  if (largeRooms.length === 0 && courses.some(course => course.requiredRoomCapacity >= 100)) {
    insights.push("There are courses requiring large rooms (100+ capacity) but no such rooms exist.");
  }
  
  // Analyze requests
  const requestsByPeriod: Record<string, number> = {};
  requests.forEach(request => {
    if (!requestsByPeriod[request.period]) {
      requestsByPeriod[request.period] = 0;
    }
    requestsByPeriod[request.period]++;
  });
  
  const periods = Object.keys(requestsByPeriod);
  const maxRequestsPeriod = periods.reduce((a, b) => 
    requestsByPeriod[a] > requestsByPeriod[b] ? a : b, periods[0]);
    
  insights.push(`Period ${maxRequestsPeriod} has the highest number of requests: ${requestsByPeriod[maxRequestsPeriod]}`);
  
  // Check for course popularity
  const coursePopularity: Record<string, number> = {};
  requests.forEach(request => {
    request.courseChoices.forEach((courseId, index) => {
      if (!coursePopularity[courseId]) {
        coursePopularity[courseId] = 0;
      }
      // Weight by preference (first choice gets 3 points, second gets 2, third gets 1)
      coursePopularity[courseId] += (3 - index);
    });
  });
  
  const sortedCourses = Object.entries(coursePopularity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => courses.find(c => c.id === id)?.name || id);
  
  insights.push(`Most popular courses (weighted by preference): ${sortedCourses.join(', ')}`);
  
  // Compile statistics
  statistics.totalLecturers = lecturers.length;
  statistics.totalRooms = rooms.length;
  statistics.totalCourses = courses.length;
  statistics.totalRequests = requests.length;
  statistics.periodDistribution = requestsByPeriod;
  statistics.averageCoursesPerLecturer = 
    Object.values(coursesPerLecturer).reduce((sum, count) => sum + count, 0) / lecturers.length;
  
  return { insights, statistics };
}

/**
 * Checks if the matching results satisfy constraints
 */
export function validateMatchResults(
  results: MatchResult[],
  lecturers: Lecturer[],
  rooms: Room[],
  courses: Course[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Group by period
  const resultsByPeriod: Record<string, MatchResult[]> = {};
  results.forEach(result => {
    if (!resultsByPeriod[result.period]) {
      resultsByPeriod[result.period] = [];
    }
    resultsByPeriod[result.period].push(result);
  });
  
  // Check each period
  Object.entries(resultsByPeriod).forEach(([period, periodResults]) => {
    // Count courses per lecturer
    const lecturerCourseCount: Record<string, number> = {};
    
    // Track course enrollments
    const courseEnrollments: Record<string, number> = {};
    
    periodResults.forEach(result => {
      if (result.assignedCourseId) {
        // Count course enrollment
        if (!courseEnrollments[result.assignedCourseId]) {
          courseEnrollments[result.assignedCourseId] = 0;
        }
        courseEnrollments[result.assignedCourseId]++;
        
        // Update lecturer count
        const course = courses.find(c => c.id === result.assignedCourseId);
        if (course) {
          if (!lecturerCourseCount[course.lecturerId]) {
            lecturerCourseCount[course.lecturerId] = 0;
          }
          lecturerCourseCount[course.lecturerId]++;
        }
      }
    });
    
    // Check lecturer constraints
    Object.entries(lecturerCourseCount).forEach(([lecturerId, count]) => {
      const lecturer = lecturers.find(l => l.id === lecturerId);
      if (lecturer) {
        if (!lecturer.availablePeriods.includes(period)) {
          errors.push(`Lecturer ${lecturer.name} is assigned to teach in period ${period} but is not available`);
        }
        
        if (count > lecturer.maxCoursesPerPeriod) {
          errors.push(`Lecturer ${lecturer.name} is assigned ${count} courses in period ${period}, exceeding limit of ${lecturer.maxCoursesPerPeriod}`);
        }
      }
    });
    
    // Check room capacity constraints
    Object.entries(courseEnrollments).forEach(([courseId, enrollment]) => {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        // Check if there's a room that can accommodate this course
        const suitableRooms = rooms.filter(
          room => room.capacity >= course.requiredRoomCapacity && 
                  room.availablePeriods.includes(period)
        );
        
        if (suitableRooms.length === 0) {
          errors.push(`Course ${course.name} is scheduled in period ${period} but no suitable room exists`);
        }
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Converts raw data from spreadsheet into structured objects
 * This function would need to be customized based on your Excel structure
 */
export function convertRawData(rawData: any[]): {
  lecturers: Lecturer[];
  rooms: Room[];
  courses: Course[];
  requests: StudentRequest[];
} {
  // This is a placeholder for the actual conversion logic
  // You would need to adapt this based on your Excel structure
  
  const lecturers: Lecturer[] = [];
  const rooms: Room[] = [];
  const courses: Course[] = [];
  const requests: StudentRequest[] = [];
  
  // Example conversion (you'll need to customize this)
  rawData.forEach(row => {
    // Logic to extract and transform data from Excel rows
    // ...
  });
  
  return { lecturers, rooms, courses, requests };
}
