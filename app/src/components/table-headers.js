export const TABLE_HEADERS = {
    Assignments: [
        { label: "ID", accessor: "assignment_id" },
        { label: "Course ID", accessor: "course_id" },
        { label: "Week Number", accessor: "week_num" },
        { label: "Title", accessor: "assignment_title" },
        { label: "Max Points", accessor: "max_points" },
        { label: "Extra Credit", accessor: "extra_credit" },
    ],

    Billings: [
        { label: "ID", accessor: "billing_id" },
        { label: "Student ID", accessor: "student_id" },
        { label: "Status", accessor: "billing_status" },
        { label: "Due Date", accessor: "due_date" },
        { label: "Amount Due", accessor: "amount_due" },
        { label: "Amount Paid", accessor: "amount_paid" }
    ],

    Courses: [
        { label: "ID", accessor: "course_id" },
        { label: "Code", accessor: "course_code" },
        { label: "Title", accessor: "course_title" },
        { label: "Status", accessor: "course_status" }
    ],

    Students: [
        { label: "ID", accessor: "student_id" },
        { label: "First Name", accessor: "first_name" },
        { label: "Last Name", accessor: "last_name" },
        { label: "Enrollment Date", accessor: "enrollment_date" },
        { label: "Status", accessor: "student_status" },
        { label: "Degree Level", accessor: "degree_level"},
        { label: "Major", accessor: "degree_major"}
    ],

    Student_Course_Enrollments: [
        { label: "ID", accessor: "enrollment_id" },
        { label: "Student ID", accessor: "student_id" },
        { label: "Term-Course ID", accessor: "term_course_id" },
        { label: "Enrollment Date", accessor: "enrollment_date" },
        { label: "Letter Grade", accessor: "grade_let" },
        { label: "Number Grade", accessor: "grade_num" }
    ],

    Student_Course_Assignment_Grades: [
        { label: "ID", accessor: "grade_id" },
        { label: "Student ID", accessor: "student_id" },
        { label: "Term-Course ID", accessor: "term_course_id" },
        { label: "Assignment ID", accessor: "assignment_id" },
        { label: "Completed", accessor: "completed" },
        { label: "Points Earched", accessor: "points_earned" },
        { label: "Due Date", accessor: "due_date" },
        { label: "Submission Date", accessor: "submission_date" }
    ],

    Teachers: [
        { label: "ID", accessor: "teacher_id" },
        { label: "First Name", accessor: "first_name" },
        { label: "Last Name", accessor: "last_name" },
        { label: "Hire Date", accessor: "hire_date" },
        { label: "Status", accessor: "teacher_status" }
    ],

    Terms: [
        { label: "ID", accessor: "term_id" },
        { label: "Term Name", accessor: "term_name" },
        { label: "Start Date", accessor: "date_start" },
        { label: "End Date", accessor: "date_end" }
    ],
    Term_Courses: [
        { label: "ID", accessor: "term_course_id" },
        { label: "Term ID", accessor: "term_id" },
        { label: "Course ID", accessor: "course_id" },
        { label: "Teacher ID", accessor: "teacher_id" },
        { label: "Num Sudents", accessor: "num_students" }
    ]
}