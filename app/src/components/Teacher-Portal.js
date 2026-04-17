import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { TABLE_HEADERS } from "./table-headers";

import Popup_Date from "./Popup-Date";
import Table from "./Table";

import Form_Edit from "./Form-Edit";


function Teacher_Portal({ teacherID, edit }) {
    const [courseTime, setCourseTime] = useState("Present");
    const [courseArray, setCourseArray] = useState([]);
    const [courseSelected, setCourseSelected] = useState([]);

    const [studentArray, setStudentArray] = useState([]);
    const [studentSelected, setStudentSelected] = useState([]);

    const [assignmentArray, setAssignmentArray] = useState([]);
    const [assignmentSelected, setAssignmentSelected] = useState([]);

    const [gradeArray, setGradeArray] = useState([]);
    const [gradeSelected, setGradeSelected] = useState([]);

    const [studentsForModal, setStudentsForModal] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const modalRef = useRef();

    //const courseHeaders = TABLE_HEADERS.Term_Courses;
    const courseHeaders = [
        { label: "Term ID", accessor: "Terms.term_name" },
        { label: "Course ID", accessor: "Courses.course_code" },
        { label: "Num Sudents", accessor: "num_students" }
    ]

    //const studentHeaders = TABLE_HEADERS.Students;
    const studentHeaders = [
        { label: "First Name", accessor: "Students.first_name" },
        { label: "Last Name", accessor: "Students.last_name" },
        { label: "Grade Number", accessor: "grade_num" },
        { label: "Grade Letter", accessor: "grade_let" }
    ]
    
    //const gradeHeaders = TABLE_HEADERS.Student_Course_Assignment_Grades;
    const gradeHeaders = [
        { label: "Assignment Name", accessor: "Assignments.assignment_title" },
        { label: "Week", accessor: "Assignments.week_num"},
        { label: "Student Grade", accessor: "points_earned" },
        { label: "Max Grade", accessor: "Assignments.max_points" },
        { label: "Submission Date", accessor: "submission_date" },
        { label: "Due Date", accessor: "due_date" }
    ]
    const assignmentHeaders = TABLE_HEADERS.Assignments;

    useEffect(() =>{
        if (courseTime.length === 0) return;
        setCourseArray([]);
        setStudentArray([]);

        setCourseSelected([]);
        setStudentSelected([]);
        
        fetchCourseData();
    }, [courseTime])

    useEffect(() => {
        fetchAssignmentData();
    }, [courseSelected])

    useEffect(() => {
        fetchGradeData();
    }, [studentSelected])

    const fetchCourseData = async () => {
        const today = new Date().toISOString().slice(0,10);
        let filter = "";

        if (courseTime === "Past") {
            filter = `&Terms.date_end=lt.${today}`;
        } else if (courseTime === "Present") {
            filter = `&Terms.date_start=lte.${today}&Terms.date_end=gte.${today}`;
        } else if (courseTime === "Future") {
            filter = `&Terms.date_start=gt.${today}`;
        }

        setLoading(true);
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Term_Courses?teacher_id=eq.${teacherID}&select=*,Terms!inner(*),Courses(*)${filter}`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setCourseArray(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setCourseArray([]);
        } finally {
            setLoading(false);
            setCourseSelected([]);
        }
    };

    const fetchAssignmentData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Assignments?course_id=eq.${courseSelected[0].course_id}`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setAssignmentArray(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setAssignmentArray([]);
        } finally {
            setLoading(false);
            setAssignmentSelected([]);
        }
    };

    const fetchGradeData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Student_Course_Assignment_Grades?term_course_id=eq.${courseSelected[0].term_course_id}&student_id=eq.${studentSelected[0].student_id}&select=*,Students(*),Assignments(*)`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setGradeArray(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setGradeArray([]);
        } finally {
            setLoading(false);
            setGradeSelected([]);
        }
    };

    // Function to run when top table entity is selected
    const handleCourseSelect = (id) => {
        setCourseSelected([courseArray.find(s => s.term_course_id === id)]);
        const fetchStudentData = async () => {
            try {
                const response = await fetch(
                //`${process.env.REACT_APP_API}/Student_Course_Enrollments?term_course_id=eq.${id}&select=*,Students(*)${filter}`
                `${process.env.REACT_APP_API}/Student_Course_Enrollments?term_course_id=eq.${id}&select=*,Students(first_name, last_name)`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setStudentArray(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setStudentArray([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }

    const handleStudentSelect = (id) => {
        setStudentSelected([studentArray.find(s => s.enrollment_id === id)]);
    }

    const handleAssignmentSelect = (id) => {
        setAssignmentSelected([assignmentArray.find(s => s.assignment_id === id)]);
    }

    const handleGradeSelect = (id) => {
        const gradesHeavy = [gradeArray.find(s => s.grade_id === id)];
        const gradesLite = gradesHeavy.map(g => ({
            grade_id: g.grade_id,
            completed: g.completed,
            points_earned: g.points_earned,
            submission_date: g.submission_date,
            due_date: g.due_date,
            feedback: g.feedback
        }));
        //setGradeSelected(gradeArray.find(s => s.grade_id === id));
        setGradeSelected(gradesLite[0]);
    }

    const createGradeRows = async (students, dueDate) => {
        if (assignmentSelected.length === 0) { window.alert("No assignment selected!"); return };
        if (courseSelected.length === 0) { window.alert("No course selected!"); return };
        if (students.length === 0) { window.alert("No students provided!"); return };
        const rows = students.map(s => ({
            student_id: s.student_id,
            term_course_id: courseSelected[0].term_course_id,
            assignment_id: assignmentSelected[0].assignment_id,
            points_earned: 0,
            due_date: dueDate
        }));
        const res = await fetch(
            `${process.env.REACT_APP_API}/Student_Course_Assignment_Grades`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify(rows)
            }
        );
        if (!res.ok) {
            const text = await res.text();
            console.error("Insert error:", text);
            throw new Error("Failed to create grade rows");
        }
        return true;
    };

    function diffObjects(original, updated) {
        const changed = {};
        for (const key in updated) {
            if (updated[key] !== original[key]) {
            changed[key] = updated[key];
            }
        }
        return changed;
    }

    const handleGradeSave = async (updatedData) => {
        const id = updatedData.grade_id;
        const prevRow = gradeArray.find(s => s.grade_id === id)
        const update = diffObjects(prevRow, updatedData);
        if (update.points_earned && update.points_earned > prevRow.Assignments.max_points) {
            window.alert(`ERROR:\n\n     Grade ${update.points_earned} exceeds maximum grade of ${prevRow.Assignments.max_points} \n          Grade not saved!`); 
            return;
        };
        const response = await fetch(`${process.env.REACT_APP_API}/Student_Course_Assignment_Grades?grade_id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // If authentication is required:
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(update) // e.g., { column_name: "new value" }
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("PATCH error:", text);
            throw new Error("Failed to update");
        };
        const index = gradeArray.findIndex(s => s.grade_id === id);
        if (index != -1) {
            setGradeArray(prev => {
                const copy = [...prev];     // Shallow copy
                copy[index] = {
                    ...copy[index],   // keep existing fields
                    ...updatedData    // overwrite only the fields you changed
                };
                return copy;                // return the new array
            });
        };
        return response;

    }

    return (
        <>
            <h1>{courseTime} Courses</h1>
            <div className="App-Table-Many">
                <div className="Table">
                    <button onClick={() => setCourseTime("Past")}>
                        Past
                    </button>
                    <button onClick={() => setCourseTime("Present")}>
                        Present
                    </button>
                    <button onClick={() => setCourseTime("Future")}>
                        Future
                    </button>
                    {courseArray.length === 0 ? (
                        <>
                            <br></br>
                            <h1>None found</h1>
                        </>
                    ) : (
                        <Table columns={courseHeaders} data={courseArray} idField="term_course_id" onSelect={handleCourseSelect} />
                    )}
                </div>
            </div>
            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        {courseSelected.length === 0 ? "No Course Selected" : "Course Students"}
                    </h1>
                    {courseSelected.length === 0 ? (
                        ""
                    ) : (
                        <Table columns={studentHeaders} data={studentArray} idField="enrollment_id" onSelect={handleStudentSelect} />
                    )}
                </div>
            </div>
            {edit === "assignments" ? (
                <div className="App-Table-Many">
                    <div className="Table">
                        <h1>
                            {courseSelected.length === 0 ? "No Course Selected" : "Course Assignments"}
                        </h1>
                        {courseSelected.length === 0 ? (
                            ""
                        ) : (
                            <>
                                {assignmentSelected.length !== 0 ? (
                                    <>
                                        <button 
                                            onClick={() => {
                                                setStudentsForModal(studentSelected);
                                                modalRef.current.open()}}
                                            >
                                            Add Assignment to Selected Student
                                        </button>
                                        <button
                                            onClick={() => {
                                                setStudentsForModal(studentArray);
                                                modalRef.current.open(studentArray)}}
                                        >
                                            Add Assignment to All Students
                                        </button>
                                        <Popup_Date
                                            ref={modalRef}
                                            defaultValue={
                                                new Date(
                                                    new Date(courseSelected[0].Terms.date_start).getTime() +
                                                    ((assignmentSelected[0].week_num - 1) * 7 + 5) * 24 * 60 * 60 * 1000
                                                ).toISOString().split("T")[0]
                                            }
                                            onDateSelected={(d) => createGradeRows( studentsForModal, d )}
                                        />
                                    </>
                                ) : null }
                                <Table columns={assignmentHeaders} data={assignmentArray} idField="assignment_id" onSelect={handleAssignmentSelect} />
                                
                            </>
                        )}
                    </div>
                </div>
            ) : null }

            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        {studentSelected.length === 0
                            ? "No Student Selected"
                            : `${studentSelected[0].Students.first_name} ${studentSelected[0].Students.last_name} - Grades`}
                    </h1>
                    {studentSelected.length === 0 ? (
                        ""
                    ) : (
                        <Table columns={gradeHeaders} data={gradeArray} idField="grade_id" onSelect={handleGradeSelect} />
                    )}
                </div>
            </div>

            {edit === "grades" ? (
                <div className="App-Form-Outer">
                    {gradeSelected.length === 0 ? (
                        <h1>No Grade Row Selected</h1>
                    ) : (
                        <Form_Edit title="Edit Student" rawData={gradeSelected} idField="grade_id" onSave={handleGradeSave} />
                    )}
                </div>
            ) : null }
        </>
    );
};

export default Teacher_Portal;