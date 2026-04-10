import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Terms() {

    const [Terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [term, setTerm] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyTerm, setEmptyTerm] = useState();

    const table_headers = [
        { label: "Term ID", accessor: "term_id" },
        { label: "Term Name", accessor: "term_name" },
        { label: "Start Date", accessor: "date_start" },
        { label: "End Date", accessor: "date_end" }
    ]

    useEffect(() =>{
        if (Terms.length === 0) return;
        setEmptyTerm(
            Object.fromEntries(
                Object.keys(Terms[0])
                .filter(key => key !== "term_id") 
                .map(key => [key, ""])
            )
        );
    }, [Terms])

    useEffect(() => {
        const fetchTermData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Terms`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setTerms(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setTerms([]);
        } finally {
            setLoading(false);
        }
        };

        fetchTermData();
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
        setTerm(Terms.find(s => s.term_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Terms`, {
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
        const newTerm = inserted[0];

        // Add to Terms state
        setTerms(prev => [...prev, newTerm]);

        return newTerm;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.term_id;
        const update = diffObjects(Terms.find(s => s.term_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Terms?term_id=eq.${id}`, {
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
        const index = Terms.findIndex(s => s.term_id === id);
        if (index != -1) {
            setTerms(prev => {
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
                            Terms
                        </h1>
                        <button
                            className={formState === "add" ? "Selected" : ""}
                            onClick={() => setFormState("add")}
                        >
                            Add Term
                        </button>
                        <button
                            className={formState === "edit" ? "Selected" : ""}
                            onClick={() => setFormState("edit")}
                        >
                            Edit Term
                        </button>
                        <button
                            className={formState === "view" ? "Selected" : ""}
                            onClick={() => setFormState("view")}
                        >
                            View Term
                        </button>
                        <Table columns={table_headers} data={Terms} idField="term_id" onSelect={handleTableSelect}/>
                    </div>
                </div>

            <div className="App-Form-Outer">
                {!term ? (
                    <h1>...No Term Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Term" rawData={emptyTerm} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Term" rawData={term} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Term" rawData={term} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Terms;