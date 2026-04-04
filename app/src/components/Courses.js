import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Courses() {

    const [Courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyCourse, setEmptyCourse] = useState();

    const table_headers = [
        { label: "Course ID", accessor: "class_id" },
        { label: "Code", accessor: "class_code" },
        { label: "Title", accessor: "class_title" },
        { label: "Status", accessor: "class_status" }
    ]

    useEffect(() =>{
        if (Courses.length === 0) return;
        setEmptyCourse(
            Object.fromEntries(
                Object.keys(Courses[0])
                .filter(key => key !== "class_id") 
                .map(key => [key, ""])
            )
        );
    }, [Courses])

    useEffect(() => {
        const fetchCourseData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Classes`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setCourses(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setCourses([]);
        } finally {
            setLoading(false);
        }
        };

        fetchCourseData();
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
        setCourse(Courses.find(s => s.class_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Classes`, {
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
        const newCourse = inserted[0];

        // Add to Courses state
        setCourses(prev => [...prev, newCourse]);

        return newCourse;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.class_id;
        const update = diffObjects(Courses.find(s => s.class_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Classes?class_id=eq.${id}`, {
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
        const index = Courses.findIndex(s => s.class_id === id);
        if (index != -1) {
            setCourses(prev => {
                const copy = [...prev];     // Shallow copy
                copy[index] = updatedData;  // replace only the one entry
                return copy;                // return the new array
            });
        };
        return response;
    };

    return (
        <div>
            <div className="App-Table">

                    <div className="Table">
                        <h1>
                            Courses
                        </h1>
                        <button
                            className={formState === "add" ? "Selected" : ""}
                            onClick={() => setFormState("add")}
                        >
                            Add Course
                        </button>
                        <button
                            className={formState === "edit" ? "Selected" : ""}
                            onClick={() => setFormState("edit")}
                        >
                            Edit Course
                        </button>
                        <button
                            className={formState === "view" ? "Selected" : ""}
                            onClick={() => setFormState("view")}
                        >
                            View Course
                        </button>
                        <Table columns={table_headers} data={Courses} idField="class_id" onSelect={handleTableSelect}/>
                    </div>
                </div>

            <div className="App-Form-Outer">
                {!course ? (
                    <h1>...No Course Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Course" rawData={emptyCourse} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Course" rawData={course} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Course" rawData={course} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Courses;