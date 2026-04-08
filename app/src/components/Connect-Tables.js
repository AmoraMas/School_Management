import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Connect_Tables({ one, many, one_id, many_id }) {
    const [oneArray, setOneArray] = useState([]);
    const [oneSelected, setOneSelected] = useState([]);
    const [oneHeaders, setOneHeaders] = useState([]);
    const [manyArray, setManyArray] = useState([]);
    const [manySelected, setManySelected] = useState([]);
    const [manyHeaders, setManyHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>{
        if (oneArray.length === 0) return;
        setOneHeaders(generateHeaders(oneArray))
    }, [oneArray])

    useEffect(() =>{
        if (oneArray.length === 0) return;
        setManyHeaders(generateHeaders(manyArray))
    }, [manyArray])

    useEffect(() => {
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
    }, []);

    useEffect(() => {
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
    }, []);

    const handleReset = () => {
        setOneSelected([]);
        setManySelected([]);
    }

    const handleOneSelect = (id) => {
        setOneSelected([oneArray.find(s => s[one_id] === id)]);
    }

    const handleManySelect = (id) => {
        setManySelected([oneArray.find(s => s[many_id] === id)]);
    }


    return (
        <div>
            <div className="App-Table">
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
            <div className="App-Table">
                <div className="Table">
                    <h1>
                        {oneSelected.length === 0 ? "None Selected" : many}
                    </h1>

                        {oneSelected.length === 0 ? (
                            ""
                        ) : (
                            <Table columns={manyHeaders} data={manyArray} idField={many_id} onSelect={handleManySelect}/>
                        )}
                </div>
            </div>
        </div>
    )

    function generateHeaders(data) {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0])
        .filter(key => !isIdField(key))
        .map(key => ({
            label: formatLabel(key),
            accessor: key
        }));
    }

    function isIdField(key) {
        return key === "id" || key.endsWith("_id");
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