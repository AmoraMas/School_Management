import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Assignments() {

    const [Assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignment, setAssignment] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyAssignment, setEmptyAssignment] = useState();

    const table_headers = [
        { label: "Assignment ID", accessor: "assignment_id" },
        { label: "Course ID", accessor: "course_id" },
        { label: "Week Number", accessor: "week_num" },
        { label: "Title", accessor: "assignment_title" },
        { label: "Max Points", accessor: "max_points" },
        { label: "Extra Credit", accessor: "extra_credit" },
    ]

    useEffect(() =>{
        if (Assignments.length === 0) return;
        setEmptyAssignment(
            Object.fromEntries(
                Object.keys(Assignments[0])
                .filter(key => key !== "assignment_id") 
                .map(key => [key, ""])
            )
        );
    }, [Assignments])

    useEffect(() => {
        const fetchAssignmentData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Assignments`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setAssignments(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setAssignments([]);
        } finally {
            setLoading(false);
        }
        };

        fetchAssignmentData();
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
        setAssignment(Assignments.find(s => s.assignment_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Assignments`, {
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
        const newAssignment = inserted[0];

        // Add to Assignments state
        setAssignments(prev => [...prev, newAssignment]);

        return newAssignment;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.assignment_id;
        const update = diffObjects(Assignments.find(s => s.assignment_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Assignments?assignment_id=eq.${id}`, {
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
        const index = Assignments.findIndex(s => s.assignment_id === id);
        if (index != -1) {
            setAssignments(prev => {
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
                            Assignments
                        </h1>
                        <button
                            className={formState === "add" ? "Selected" : ""}
                            onClick={() => setFormState("add")}
                        >
                            Add Assignment
                        </button>
                        <button
                            className={formState === "edit" ? "Selected" : ""}
                            onClick={() => setFormState("edit")}
                        >
                            Edit Assignment
                        </button>
                        <button
                            className={formState === "view" ? "Selected" : ""}
                            onClick={() => setFormState("view")}
                        >
                            View Assignment
                        </button>
                        <Table columns={table_headers} data={Assignments} idField="assignment_id" onSelect={handleTableSelect}/>
                    </div>
                </div>

            <div className="App-Form-Outer">
                {!assignment ? (
                    <h1>...No Assignment Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Assignment" rawData={emptyAssignment} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Assignment" rawData={assignment} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Assignment" rawData={assignment} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Assignments;