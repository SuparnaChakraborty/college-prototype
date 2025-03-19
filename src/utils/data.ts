
import { Lecturer, Room, Course, StudentRequest } from './types';

// Sample data based on Crestwood dataset
// In a real application, this would be fetched from an API

export const lecturers: Lecturer[] = [
  {
    id: "L1",
    name: "Dr. Sarah Johnson",
    maxCoursesPerPeriod: 2,
    availablePeriods: ["A", "B", "C", "D"]
  },
  {
    id: "L2",
    name: "Prof. Michael Chen",
    maxCoursesPerPeriod: 1,
    availablePeriods: ["A", "C", "E"]
  },
  {
    id: "L3",
    name: "Dr. Emily Rodriguez",
    maxCoursesPerPeriod: 2,
    availablePeriods: ["B", "D", "F"]
  },
  {
    id: "L4",
    name: "Prof. James Wilson",
    maxCoursesPerPeriod: 1,
    availablePeriods: ["A", "B", "E", "F"]
  },
  {
    id: "L5",
    name: "Dr. Lisa Thompson",
    maxCoursesPerPeriod: 2,
    availablePeriods: ["C", "D", "E"]
  }
];

export const rooms: Room[] = [
  {
    id: "R1",
    name: "Main Hall",
    capacity: 200,
    availablePeriods: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "R2",
    name: "Room 101",
    capacity: 30,
    availablePeriods: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "R3",
    name: "Room 102",
    capacity: 30,
    availablePeriods: ["A", "B", "C", "D", "E", "F"]
  },
  {
    id: "R4",
    name: "Science Lab",
    capacity: 40,
    availablePeriods: ["B", "D", "F"]
  },
  {
    id: "R5",
    name: "Computer Lab",
    capacity: 25,
    availablePeriods: ["A", "C", "E"]
  }
];

export const courses: Course[] = [
  {
    id: "C1",
    code: "MATH101",
    name: "Introduction to Calculus",
    lecturerId: "L1",
    requiredRoomCapacity: 120
  },
  {
    id: "C2",
    code: "PHYS200",
    name: "Classical Mechanics",
    lecturerId: "L2",
    requiredRoomCapacity: 80
  },
  {
    id: "C3",
    code: "CS150",
    name: "Programming Fundamentals",
    lecturerId: "L3",
    requiredRoomCapacity: 25
  },
  {
    id: "C4",
    code: "ENG220",
    name: "Creative Writing",
    lecturerId: "L4",
    requiredRoomCapacity: 30
  },
  {
    id: "C5",
    code: "HIST110",
    name: "World History",
    lecturerId: "L1",
    requiredRoomCapacity: 150
  },
  {
    id: "C6",
    code: "BIO240",
    name: "Human Anatomy",
    lecturerId: "L5",
    requiredRoomCapacity: 40
  },
  {
    id: "C7",
    code: "CHEM180",
    name: "Organic Chemistry",
    lecturerId: "L2",
    requiredRoomCapacity: 30
  },
  {
    id: "C8",
    code: "PSYCH101",
    name: "Introduction to Psychology",
    lecturerId: "L3",
    requiredRoomCapacity: 200
  }
];

export const studentRequests: StudentRequest[] = [
  {
    id: "SR1",
    studentId: "S1",
    studentName: "Alex Smith",
    period: "A",
    courseChoices: ["C1", "C2", "C5"]
  },
  {
    id: "SR2",
    studentId: "S2",
    studentName: "Jamie Taylor",
    period: "A",
    courseChoices: ["C2", "C5", "C7"]
  },
  {
    id: "SR3",
    studentId: "S3",
    studentName: "Morgan Wright",
    period: "B",
    courseChoices: ["C1", "C3", "C8"]
  },
  {
    id: "SR4",
    studentId: "S4",
    studentName: "Casey Jones",
    period: "B",
    courseChoices: ["C3", "C8", "C4"]
  },
  {
    id: "SR5",
    studentId: "S5",
    studentName: "Jordan Lee",
    period: "C",
    courseChoices: ["C2", "C6", "C7"]
  },
  {
    id: "SR6",
    studentId: "S6",
    studentName: "Riley Garcia",
    period: "C",
    courseChoices: ["C6", "C7", "C2"]
  },
  {
    id: "SR7",
    studentId: "S7",
    studentName: "Quinn Peterson",
    period: "D",
    courseChoices: ["C1", "C6", "C8"]
  },
  {
    id: "SR8",
    studentId: "S8",
    studentName: "Avery Martinez",
    period: "D",
    courseChoices: ["C8", "C1", "C3"]
  }
];

// Helper function to get course by ID
export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

// Helper function to get lecturer by ID
export function getLecturerById(id: string): Lecturer | undefined {
  return lecturers.find(lecturer => lecturer.id === id);
}

// Helper function to get lecturer for a course
export function getLecturerForCourse(courseId: string): Lecturer | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  return getLecturerById(course.lecturerId);
}

// Helper function to get room by ID
export function getRoomById(id: string): Room | undefined {
  return rooms.find(room => room.id === id);
}

// Helper function to get suitable rooms for a course
export function getSuitableRoomsForCourse(courseId: string, period: string): Room[] {
  const course = getCourseById(courseId);
  if (!course) return [];
  
  return rooms.filter(room => 
    room.capacity >= course.requiredRoomCapacity && 
    room.availablePeriods.includes(period)
  );
}

// Simple matching algorithm
export function performMatching() {
  // Group requests by period
  const requestsByPeriod = studentRequests.reduce((acc, request) => {
    if (!acc[request.period]) {
      acc[request.period] = [];
    }
    acc[request.period].push(request);
    return acc;
  }, {} as Record<string, StudentRequest[]>);

  const results: Record<string, any> = {};
  
  // Process each period
  Object.entries(requestsByPeriod).forEach(([period, requests]) => {
    results[period] = {
      assignments: {},
      courseEnrollments: {},
      lecturerAssignments: {},
      roomAssignments: {}
    };
    
    // Initialize course enrollments
    courses.forEach(course => {
      results[period].courseEnrollments[course.id] = 0;
    });
    
    // Initialize lecturer assignments
    lecturers.forEach(lecturer => {
      results[period].lecturerAssignments[lecturer.id] = 0;
    });
    
    // Process student requests
    requests.forEach(request => {
      // Try to assign student to their preferred courses in order
      for (const courseId of request.courseChoices) {
        const course = getCourseById(courseId);
        const lecturer = getLecturerForCourse(courseId);
        
        if (!course || !lecturer) continue;
        
        // Check if lecturer is available
        if (!lecturer.availablePeriods.includes(period) || 
            results[period].lecturerAssignments[lecturer.id] >= lecturer.maxCoursesPerPeriod) {
          continue;
        }
        
        // Find suitable room
        const suitableRooms = getSuitableRoomsForCourse(courseId, period);
        if (suitableRooms.length === 0) continue;
        
        // Assign student to course
        results[period].assignments[request.studentId] = {
          studentName: request.studentName,
          courseId: courseId,
          courseName: course.name,
          satisfied: true,
          preference: request.courseChoices.indexOf(courseId) + 1
        };
        
        // Update course enrollment
        results[period].courseEnrollments[courseId]++;
        
        // Update lecturer assignment if this is a new course
        if (results[period].courseEnrollments[courseId] === 1) {
          results[period].lecturerAssignments[lecturer.id]++;
          // Assign room (simplified - in reality would need more complex logic)
          results[period].roomAssignments[courseId] = suitableRooms[0].id;
        }
        
        break;
      }
      
      // If student couldn't be assigned to any course
      if (!results[period].assignments[request.studentId]) {
        results[period].assignments[request.studentId] = {
          studentName: request.studentName,
          courseId: null,
          courseName: null,
          satisfied: false,
          preference: null
        };
      }
    });
  });
  
  return results;
}
