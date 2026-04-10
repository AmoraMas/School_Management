import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Students() {

    const [Students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [student, setStudent] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyStudent, setEmptyStudent] = useState();

    const table_headers = [
        { label: "Student ID", accessor: "student_id" },
        { label: "First Name", accessor: "first_name" },
        { label: "Last Name", accessor: "last_name" },
        { label: "Enrollment Date", accessor: "enrollment_date" },
        { label: "Status", accessor: "student_status" }
    ]

    useEffect(() =>{
        if (Students.length === 0) return;
        setEmptyStudent(
            Object.fromEntries(
                Object.keys(Students[0])
                .filter(key => key !== "student_id") 
                .map(key => [key, ""])
            )
        );
    }, [Students])

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/Students`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setStudents(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    function diffObjects(original, updated) {
        const changed = {};
        for (const key in updated) {
            if (updated[key] !== original[key]) {
            changed[key] = updated[key];
            }
        }
        return changed;
    }

    const handleTableSelect = (id) => {
        setStudent(Students.find(s => s.student_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Students`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
                // If authentication is required:
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData) // e.g., { column_name: "new value" }
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("PATCH error:", text);
            throw new Error("Failed to update");
        };
        // PostgREST returns an array of inserted rows
        const inserted = await response.json();
        const newStudent = inserted[0];

        // Add to Students state
        setStudents(prev => [...prev, newStudent]);

        return newStudent;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.student_id;
        const update = diffObjects(Students.find(s => s.student_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Students?student_id=eq.${id}`, {
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
        const index = Students.findIndex(s => s.student_id === id);
        if (index != -1) {
            setStudents(prev => {
                const copy = [...prev];     // Shallow copy
                copy[index] = updatedData;  // replace only the one entry
                return copy;                // return the new array
            });
        };
        return response;
    };

    return (
        <div>
            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        Students
                    </h1>
                    <button
                        className={formState === "add" ? "Selected" : ""}
                        onClick={() => setFormState("add")}
                    >
                        Add Student
                    </button>
                    <button
                        className={formState === "edit" ? "Selected" : ""}
                        onClick={() => setFormState("edit")}
                    >
                        Edit Student
                    </button>
                    <button
                        className={formState === "view" ? "Selected" : ""}
                        onClick={() => setFormState("view")}
                    >
                        View Student
                    </button>
                    <Table columns={table_headers} data={Students} idField="student_id" onSelect={handleTableSelect}/>
                </div>
            </div>

            <div className="App-Form-Outer">
                {!student ? (
                    <h1>...No Student Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Student" rawData={emptyStudent} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Student" rawData={student} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Student" rawData={student} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Students;