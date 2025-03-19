
# Course Matcher System

## Project Overview
This application is designed to optimize course scheduling for educational institutions by matching students with courses based on their preferences while considering constraints like room capacity, lecturer availability, and period conflicts.

## Approach to the Task

### 1. Data Modeling
The system is built around four primary data types:
- **Lecturers**: Faculty members who teach courses, with constraints on teaching loads per period
- **Rooms**: Physical spaces where courses are taught, with capacity constraints
- **Courses**: Academic offerings that require specific lecturers and minimum room capacities
- **Student Requests**: Student preferences for courses in specific periods, ranked by priority

### 2. Validation System
A comprehensive validation system checks for:
- Course capacity constraints
- Lecturer availability and teaching load limits
- Room capacity and availability
- Valid student course preferences
- Period conflicts

### 3. Matching Algorithm
The matching algorithm follows these steps:
1. Group student requests by period
2. For each period:
   - Process each student request in the order received
   - Attempt to match students to their preferred courses in order of preference
   - Check constraints (lecturer availability, room capacity)
   - Assign students when all constraints are satisfied
   - Track metrics like satisfaction rate and preference fulfillment

### 4. Analysis and Reporting
The system provides:
- Satisfaction metrics (overall satisfaction rate, first-choice fulfillment)
- Period-by-period breakdown of assignments
- Insights into bottlenecks (overloaded lecturers, room capacity issues)
- Exportable data for further analysis

### 5. Data Export
All data can be exported to JSON format for:
- Integration with other systems
- Backup and archiving
- Advanced analysis in external tools

## Assumptions Made

1. **Preference Ordering**: Student preferences are strict and ordered (1st, 2nd, 3rd choice)
2. **Fixed Periods**: The academic periods (A, B, C, etc.) are predetermined and fixed
3. **Request Processing**: Requests are processed in the order received (first-come, first-served)
4. **Single Course Per Period**: Students take only one course per period
5. **Course Uniqueness**: Each course has a unique ID and is taught by exactly one lecturer
6. **No Course Sectioning**: Courses are not split into multiple sections with different lecturers
7. **Static Room Assignment**: Each course is assigned to one room for its entire duration
8. **Lecturer Availability**: Lecturers have predefined periods when they're available to teach
9. **No Time Preference**: Within a period, there's no preference for specific time slots
10. **Batch Processing**: All matching is done in a single batch, not incrementally over time

## Technical Implementation
- Built with React, TypeScript, and Tailwind CSS
- Modular architecture with separation of data, validation, and UI concerns
- Responsive design for use on various devices
- State management via React's built-in hooks
- Data visualization for analytics

## Future Enhancements
- Advanced matching algorithms (weighted preferences, global optimization)
- Support for course sections and multiple lecturers per course
- Interactive editing of constraints and real-time results
- Integration with existing student information systems
- Support for importing data from various formats (CSV, Excel)
