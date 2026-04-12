import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Connect_Tables({ one, one_id, many, many_id, combined, combined_id }) {
    const [oneArray, setOneArray] = useState([]);
    const [oneSelected, setOneSelected] = useState([]);
    const [oneHeaders, setOneHeaders] = useState([]);

    const [manyArray, setManyArray] = useState([]);
    const [manySelected, setManySelected] = useState([]);
    const [manyHeaders, setManyHeaders] = useState([]);

    const [combinedArray, setCombinedArray] = useState([]);
    const [combinedSelected, setCombinedSelected] = useState([]);
    const [combinedHeaders, setCombinedHeaders] = useState([]);

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
        if (combinedArray.length === 0) return;
        setCombinedHeaders(generateHeaders(combinedArray, "hide", combined_id))
    }, [combinedArray])

    useEffect(() => {
        if (oneSelected.length === 1 && one === "Term_Courses" && many === "Students") {
            updateStudentNum(oneSelected[0][one_id], combinedArray.length)
        }
    }, [combinedArray])

    // Update middle table when combined table changes
    // Update num students in Term_Courses if appropriate
    useEffect(() => {
        // Removed entries from middle table that exist in combined table
        const updated = removeMatches(manyArray, combinedArray, many_id);
        setManyArray(updated);
    }, [combinedArray])

    const updateStudentNum = async (id, num) => {
        // Update database
        const response = await fetch(`${process.env.REACT_APP_API}/${one}?${one_id}=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // If authentication is required:
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({num_students: num}) // e.g., { column_name: "new value" }
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("PATCH error:", text);
            throw new Error("Failed to update");
        };
        // Update oneSelected
        setOneSelected(prev => {
            if (prev.length === 0) return prev;
            const updated = {
                ...prev[0],
                num_students: num
            };
            return [updated]
        });
        // Update oneArray
        setOneArray(prev => {
            return prev.map(row =>
            row[one_id] === id
                ? { ...row, num_students: num }
                : row
            );
        });
    }

    // GET oneArray
    useEffect(() => {
        setOneArray([]);
        setCombinedArray([]);
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
        setOneSelected([]);
    }, [one, many]);

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
        setManySelected([]);
    }, [one, many]);

    // Function to run when top table entity is selected
    const handleOneSelect = (id) => {
        setOneSelected([oneArray.find(s => s[one_id] === id)]);
        const fetchCombinedData = async () => {
            try {
                const response = await fetch(
                `${process.env.REACT_APP_API}/${combined}?${one_id}=eq.${id}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                const fetchData = await response.json();
                setCombinedArray(fetchData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setCombinedArray([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCombinedData();
    }

    // Function to run when middle table entity is selected
    const handleManySelect = (id) => {
        setManySelected([manyArray.find(s => s[many_id] === id)]);
    }

    // Function to run when combined table entity is selected
    const handleCombinedSelect = (id) => {
        setCombinedSelected([combinedArray.find(s => s[combined_id] === id)]);
    }

    // Reset the Page
    const handleReset = () => {
        setOneSelected([]);
        setManySelected([]);
        setCombinedArray([]);
        setCombinedSelected([]);
    }

    // Add many table selection to combined table
    const handleAdd = async () => {
        // Do not allow if student_num === 20
        if (manySelected.length == 0) {
            window.alert("None selected to add!");
                return "None Selected to add!";
        }
        if (one === "Term_Courses" && many === "Students") {
            if (oneSelected[0].num_students >= 20) {
                window.alert("Max number of students already added!");
                return "Max number of students already added!";
            }
        }
        const response = await fetch(`${process.env.REACT_APP_API}/${combined}`, {
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
            console.error("POST error:", text);
            throw new Error("Failed to update");
        };
        // PostgREST returns an array of inserted rows
        const inserted = await response.json();
        const newCombined = inserted[0];

        // Add to combined table
        setCombinedArray(prev => [...prev, newCombined]);

        // Remove from middle table
        setManyArray(prev =>
            prev.filter(row =>
                !(row[many_id] === manySelected[0][many_id])
            )
        );
        return newCombined;
    }

    // Delete table selection from combined table
    const handleDelete = async () => {
        if (combinedSelected.length == 0) {
            window.alert("None selected to delete!");
                return "None Selected to delete!";
        }

        const removed_id = combinedSelected[0][combined_id]
        const responseDelete = await fetch(
            `${process.env.REACT_APP_API}/${combined}?${combined_id}=eq.${removed_id}`,
            {
                method: "DELETE",
                headers: {
                    "Prefer": "return=representation"
                    // If authentication is required:
                    // 'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!responseDelete.ok) {
            const text = await responseDelete.text();
            throw new Error("Failed to delete");
        }

        // PostgREST returns the deleted rows (array)
        const deleted = await responseDelete.json();
        const removed = deleted[0];

        // Remove from combined table
        setCombinedArray(prev =>
            prev.filter(row => !(row[combined_id] === removed_id))
        );

        const responseAdd = await fetch(
            `${process.env.REACT_APP_API}/${many}?${many_id}=eq.${removed[many_id]}`,
        );

        if (!responseAdd.ok) {
            const text = await responseAdd.text();
            throw new Error(`HTTP error: Status ${responseAdd.status}`);
        };

        const added = await responseAdd.json();
        //added = added[0]
        setManyArray(prev => [...prev, added[0]]);
        setError(null);

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
                        {combinedArray.length === 0 ? "None Selected" : many + " in " + one}
                    </h1>

                    {combinedArray.length === 0 ? (
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
                            <Table columns={combinedHeaders} data={combinedArray} idField={combined_id} onSelect={handleCombinedSelect}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    function removeMatches(sourceArray, filterArray, key) {
        const filterSet = new Set(filterArray.map(item => item[key]));
        return sourceArray.filter(item => !filterSet.has(item[key]));
    }

    // Function to generate headers automatically
    function generateHeaders(data, action, data_id) {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0])
            .filter(key => !isIdField(key, action, data_id))
            .map(key => ({
                label: formatLabel(key),
                accessor: key
            })
        );
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