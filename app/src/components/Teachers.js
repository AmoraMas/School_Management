import { useState } from "react";
import { useEffect } from "react";
import { TABLE_HEADERS } from "./table-headers";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Teachers() {

    const [Teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teacher, setTeacher] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyTeacher, setEmptyTeacher] = useState();

    const table_headers = TABLE_HEADERS.Teachers;

    useEffect(() =>{
        if (Teachers.length === 0) return;
        setEmptyTeacher(
            Object.fromEntries(
                Object.keys(Teachers[0])
                .filter(key => key !== "teacher_id") 
                .map(key => [key, ""])
            )
        );
    }, [Teachers])

    useEffect(() => {
        const fetchTeacherData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Teachers`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setTeachers(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setTeachers([]);
        } finally {
            setLoading(false);
        }
        };

        fetchTeacherData();
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
        setTeacher(Teachers.find(s => s.teacher_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Teachers`, {
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
        const newTeacher = inserted[0];

        // Add to Teachers state
        setTeachers(prev => [...prev, newTeacher]);

        return newTeacher;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.teacher_id;
        const update = diffObjects(Teachers.find(s => s.teacher_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Teachers?teacher_id=eq.${id}`, {
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
        const index = Teachers.findIndex(s => s.teacher_id === id);
        if (index != -1) {
            setTeachers(prev => {
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
                            Teachers
                        </h1>
                        <button
                            className={formState === "add" ? "Selected" : ""}
                            onClick={() => setFormState("add")}
                        >
                            Add Teacher
                        </button>
                        <button
                            className={formState === "edit" ? "Selected" : ""}
                            onClick={() => setFormState("edit")}
                        >
                            Edit Teacher
                        </button>
                        <button
                            className={formState === "view" ? "Selected" : ""}
                            onClick={() => setFormState("view")}
                        >
                            View Teacher
                        </button>
                        <Table columns={table_headers} data={Teachers} idField="teacher_id" onSelect={handleTableSelect}/>
                    </div>
                </div>

            <div className="App-Form-Outer">
                {!teacher ? (
                    <h1>...No Teacher Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Teacher" rawData={emptyTeacher} idField="teacher_id" onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Teacher" rawData={teacher} idField="teacher_id" onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Teacher" rawData={teacher} idField="teacher_id" />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Teachers;