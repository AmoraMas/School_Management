import { useState } from "react";
import { useEffect } from "react";
import { TABLE_HEADERS } from "./table-headers";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Term_Courses() {

    const [Term_Courses, setTerm_Courses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [term_course, setTerm_Course] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyTerm_Course, setEmptyTerm_Course] = useState();

    const table_headers = TABLE_HEADERS.Term_Courses;

    useEffect(() =>{
        if (Term_Courses.length === 0) return;
        setEmptyTerm_Course(
            Object.fromEntries(
                Object.keys(Term_Courses[0])
                .filter(key => key !== "term_course_id") 
                .map(key => [key, ""])
            )
        );
    }, [Term_Courses])

    useEffect(() => {
        const fetchTerm_CourseData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/Term_Courses`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setTerm_Courses(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setTerm_Courses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTerm_CourseData();
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
        setTerm_Course(Term_Courses.find(s => s.term_course_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Term_Courses`, {
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
        const newTerm_Course = inserted[0];

        // Add to Term_Courses state
        setTerm_Courses(prev => [...prev, newTerm_Course]);

        return newTerm_Course;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.term_course_id;
        const update = diffObjects(Term_Courses.find(s => s.term_course_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Term_Courses?term_course_id=eq.${id}`, {
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
        const index = Term_Courses.findIndex(s => s.term_course_id === id);
        if (index != -1) {
            setTerm_Courses(prev => {
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
                        Term_Courses
                    </h1>
                    <button
                        className={formState === "add" ? "Selected" : ""}
                        onClick={() => setFormState("add")}
                    >
                        Add Term_Course
                    </button>
                    <button
                        className={formState === "edit" ? "Selected" : ""}
                        onClick={() => setFormState("edit")}
                    >
                        Edit Term_Course
                    </button>
                    <button
                        className={formState === "view" ? "Selected" : ""}
                        onClick={() => setFormState("view")}
                    >
                        View Term_Course
                    </button>
                    <Table columns={table_headers} data={Term_Courses} idField="term_course_id" onSelect={handleTableSelect}/>
                </div>
            </div>

            <div className="App-Form-Outer">
                {!term_course ? (
                    <h1>...No Term_Course Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Term_Course" rawData={emptyTerm_Course} idField="term_course_id" onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Term_Course" rawData={term_course} idField="term_course_id" onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Term_Course" rawData={term_course} idField="term_course_id" />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Term_Courses;