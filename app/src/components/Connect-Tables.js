import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Connect_Tables({ one, one_id, many, many_id, connected, connected_id }) {
    const [oneArray, setOneArray] = useState([]);
    const [oneSelected, setOneSelected] = useState([]);
    const [oneHeaders, setOneHeaders] = useState([]);

    const [manyArray, setManyArray] = useState([]);
    const [manySelected, setManySelected] = useState([]);
    const [manyHeaders, setManyHeaders] = useState([]);

    const [connectedArray, setConnectedArray] = useState([]);
    const [connectedSelected, setConnectedSelected] = useState([]);
    const [connectedHeaders, setConnectedHeaders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Update headers when arrays change
    useEffect(() =>{
        if (oneArray.length === 0) return;
        setOneHeaders(generateHeaders(oneArray, "show", one_id))
    }, [oneArray])

    useEffect(() =>{
        if (manyArray.length === 0) return;
        setManyHeaders(generateHeaders(manyArray, "hide", many_id))
    }, [manyArray])

    useEffect(() =>{
        if (connectedArray.length === 0) return;
        setConnectedHeaders(generateHeaders(connectedArray, "hide", connected_id))
    }, [connectedArray])

    // empty Selected when Array changes
    useEffect(() => {
        setOneSelected([]);
    }, [oneArray]);

    // GET oneArray
    useEffect(() => {
        setOneArray([]);
        setConnectedArray([]);
        const fetchOneData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/${one}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setOneArray(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setOneArray([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOneData();
    }, [one]);

    // GET manyArray
    useEffect(() => {
        setManyArray([]);
        const fetchManyData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/${many}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setManyArray(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setManyArray([]);
            } finally {
                setLoading(false);
            }
        };
        fetchManyData();
    }, [many]);

    // Function to run when top table entity is selected
    const handleOneSelect = (id) => {
        setOneSelected([oneArray.find(s => s[one_id] === id)]);
        const fetchConnectedData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/${connected}?${one_id}=eq.${id}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setConnectedArray(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setConnectedArray([]);
            } finally {
                setLoading(false);
            }
        };
        fetchConnectedData();
    }

    // Function to run when middle table entity is selected
    const handleManySelect = (id) => {
        setManySelected([manyArray.find(s => s[many_id] === id)]);
    }

    // Function to run when bottom table entity is selected
    const handleConnectedSelect = (id) => {
        setConnectedSelected([connectedArray.find(s => s[connected_id] === id)]);
    }

    // Reset the Page
    const handleReset = () => {
        setOneSelected([]);
        setManySelected([]);
        setConnectedArray([]);
        setConnectedSelected([]);
    }

    // Add many table selection to combined table
    const handleAdd = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/${connected}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
                // If authentication is required:
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                [one_id]: oneSelected[0][one_id],
                [many_id]: manySelected[0][many_id]
            }) // e.g., { column_name: "new value" }
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("PATCH error:", text);
            throw new Error("Failed to update");
        };
        // PostgREST returns an array of inserted rows
        const inserted = await response.json();
        const newConnected = inserted[0];

        // Add to Students state
        setConnectedArray(prev => [...prev, newConnected]);

        return newConnected;
    }

    // Delete table selection from combined table
    const handleDelete = async () => {
        const removed_id = connectedSelected[0][connected_id]
        const response = await fetch(
            `${process.env.REACT_APP_API}/${connected}?${connected_id}=eq.${removed_id}`,
            {
                method: "DELETE",
                headers: {
                    "Prefer": "return=representation"
                    // If authentication is required:
                    // 'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error("DELETE error:", text);
            throw new Error("Failed to delete");
        }

        // PostgREST returns the deleted rows (array)
        const deleted = await response.json();
        const removed = deleted[0];

        // Remove from state
        setConnectedArray(prev =>
            prev.filter(row =>
                !(row[connected_id] === removed_id)
            )
        );

        return removed;
    };

    return (
        <div>
            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        {one}
                    </h1>
                    <button
                        onClick={() => handleReset()}
                    >
                        Reset
                    </button>
                    {oneSelected.length === 0 ? (
                        <Table columns={oneHeaders} data={oneArray} idField={one_id} onSelect={handleOneSelect}/>
                    ) : (
                        <Table columns={oneHeaders} data={oneSelected} idField={one_id} onSelect={handleOneSelect}/>
                    )}
                </div>
            </div>
            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        {oneSelected.length === 0 ? "None Selected" : many}
                    </h1>
                    {oneSelected.length === 0 ? (
                        ""
                    ) : (
                        <>
                            <button
                                onClick={() => handleAdd()}
                            >
                                Add
                            </button>
                            <Table columns={manyHeaders} data={manyArray} idField={many_id} onSelect={handleManySelect}/>
                        </>
                    )}
                </div>
            </div>
            <div className="App-Table-Many">
                <div className="Table">
                    <h1>
                        {connectedArray.length === 0 ? "None Selected" : many}
                    </h1>

                    {connectedArray.length === 0 ? (
                        ""
                    ) : (
                        <>
                            <button
                                onClick={() => handleAdd()}
                            >
                                Add
                            </button>
                            <button
                                onClick={() => handleDelete()}
                            >
                                Delete
                            </button>
                            <Table columns={connectedHeaders} data={connectedArray} idField={connected_id} onSelect={handleConnectedSelect}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    // Function to generate headers automatically
    function generateHeaders(data, action, data_id) {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0])
        .filter(key => !isIdField(key, action, data_id))
        .map(key => ({
            label: formatLabel(key),
            accessor: key
        }));
    }

    function isIdField(key, action, data_id) {
        if (action === "show") {
            if (key === data_id) return false;
            if (data_id === "all") return false;
            if (data_id === "none" && key.endsWith("_id")) return true;
            if (key.endsWith("_id")) return true;
        }
        else if (action === "hide") {
            if (key === data_id) return true;
            if (data_id === "none") return false;
            if (data_id === "all" && key.endsWith("_id")) return true;
            return false;
        }
        else {
            if (key.endsWith("_id")) return true;
        }
        return false;
    }

    // Helper to convert snake_case or camelCase into readable labels
    function formatLabel(key) {
    return key
        .replace(/_/g, " ")                 // snake_case → snake case
        .replace(/([A-Z])/g, " $1")         // camelCase → camel Case
        .replace(/\s+/g, " ")               // cleanup
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
    }
}

export default Connect_Tables;