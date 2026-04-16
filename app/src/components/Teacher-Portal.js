import { useState } from "react";
import { useEffect } from "react";
import { TABLE_HEADERS } from "./table-headers";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";


function Teacher_Portal({ teacherID }) {
    const [courseTime, setCourseTime] = useState("Present");
    const [courseArray, setCourseArray] = useState([]);
    const [courseSelected, setCourseSelected] = useState([]);

    const [studentArray, setStudentArray] = useState([]);
    const [studentSelected, setStudentSelected] = useState([]);

    const [assignmentArray, setAssignmentArray] = useState([]);
    const [assignmentSelected, setAssignemntSelected] = useState([]);

    const [gradeArray, setGradeArray] = useState([]);
    const [gradeSelected, setGradeSelected] = useState([]);

    const [student, setStudent] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyStudent, setEmptyStudent] = useState();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    const gradeHeaders = TABLE_HEADERS.Student_Course_Assignment_Grades;

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
        fetchGradeData();
    }, [courseSelected])

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
            setAssignemntSelected([]);
        }
    };

    const fetchGradeData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Student_Course_Assignment_Grades?term_course_id=eq.${courseSelected[0].term_course_id}&select=*,Students(*),Assignments(*)`
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

    const handleFormAdd = () => {

    }

    const handleFormEdit = () => {

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
                        {courseSelected.length === 0 ? "None Selected" : "Students"}
                    </h1>
                    {courseSelected.length === 0 ? (
                        ""
                    ) : (
                        <Table columns={studentHeaders} data={studentArray} idField="enrollment_id" onSelect={handleStudentSelect} />
                    )}
                </div>
            </div>
            <div className="App-Form-Outer">
                {!studentSelected ? (
                    <h1>...No Student Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Student" rawData={emptyStudent} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Student" rawData={studentArray} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Student" rawData={studentArray} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>

        </>
    );
};

export default Teacher_Portal;