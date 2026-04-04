import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Billings() {

    const [Billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [billing, setBilling] = useState([]);
    const [formState, setFormState] = useState("view");
    const [emptyBilling, setEmptyBilling] = useState();

    const table_headers = [
        { label: "Billing ID", accessor: "billing_id" },
        { label: "Student ID", accessor: "student_id" },
        { label: "Status", accessor: "billing_status" },
        { label: "Due Date", accessor: "due_date" },
        { label: "Amount Due", accessor: "amount_due" },
        { label: "Amount Paid", accessor: "amount_paid" }
    ]

    useEffect(() =>{
        if (Billings.length === 0) return;
        setEmptyBilling(
            Object.fromEntries(
                Object.keys(Billings[0])
                .filter(key => key !== "billing_id") 
                .map(key => [key, ""])
            )
        );
    }, [Billings])

    useEffect(() => {
        const fetchBillingData = async () => {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_API}/Billings`
            );
            if (!response.ok) {
            throw new Error(`HTTP error: Status ${response.status}`);
            }
            const fetchData = await response.json();
            setBillings(fetchData);
            setError(null);
        } catch (err) {
            setError(err.message);
            setBillings([]);
        } finally {
            setLoading(false);
        }
        };

        fetchBillingData();
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
        setBilling(Billings.find(s => s.billing_id === id));
    }

    const handleFormAdd = async (newData) => {
        console.log("newData:  ", newData);
        const response = await fetch(`${process.env.REACT_APP_API}/Billings`, {
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
        const newBilling = inserted[0];

        // Add to Billings state
        setBillings(prev => [...prev, newBilling]);

        return newBilling;
    }

    const handleFormEdit = async (updatedData) => {
        const id = updatedData.billing_id;
        const update = diffObjects(Billings.find(s => s.billing_id === id), updatedData);
        const response = await fetch(`${process.env.REACT_APP_API}/Billings?billing_id=eq.${id}`, {
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
        const index = Billings.findIndex(s => s.billing_id === id);
        if (index != -1) {
            setBillings(prev => {
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
                            Billings
                        </h1>
                        <button
                            className={formState === "add" ? "Selected" : ""}
                            onClick={() => setFormState("add")}
                        >
                            Add Billing
                        </button>
                        <button
                            className={formState === "edit" ? "Selected" : ""}
                            onClick={() => setFormState("edit")}
                        >
                            Edit Billing
                        </button>
                        <button
                            className={formState === "view" ? "Selected" : ""}
                            onClick={() => setFormState("view")}
                        >
                            View Billing
                        </button>
                        <Table columns={table_headers} data={Billings} idField="billing_id" onSelect={handleTableSelect}/>
                    </div>
                </div>

            <div className="App-Form-Outer">
                {!billing ? (
                    <h1>...No Billing Selected...</h1>
                ) :  formState === "add" ? (
                    <Form_Edit title="Add Billing" rawData={emptyBilling} onSave={handleFormAdd} />
                ) : formState === "edit" ? (
                    <Form_Edit title="Edit Billing" rawData={billing} onSave={handleFormEdit} />
                ) : formState === "view" ? (
                    <Form_Show title="View Billing" rawData={billing} />
                ) : (
                    <h1>Select an Action</h1>
                )}
            </div>
        </div>
    )
}

export default Billings;