import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";

function Form_Edit({ title, rawData, onSave}) {

    const [originalData, setOriginalData] = useState(() => rawData);
    const [data, setData] = useState(() => rawData);

    const selectOptions = {
        state: [
            "--", "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
            "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
            "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
            "VT","VA","WA","WV","WI","WY"
        ],
        student_status: ["-----", "active", "inactive", "suspended", "graduated"],
        teacher_status: ["-----", "active", "inactive", "suspended", "retired", "fired"],
        class_status: ["-----", "active", "inactive", "dead"],
        billing_status: ["-----", "paid", "unpaid","overdue"],
        country: ["-----", "USA", "Canada", "Mexico"]
    };

    useEffect(() => {
        if (rawData) {
            setData(rawData);
            setOriginalData(rawData);
        }
    }, [rawData]);

    function detectType(key, value) {
        if (key.includes("date")) return "date";
        else if (key.includes("email")) return "email";
        else if (key.includes("phone")) return "tel";
        else if (key.includes("description")) return "textarea";
        else if (typeof value === "boolean") return "checkbox";
        else if (typeof value === "number") return "number";
        else if (typeof value === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date";
            else if (value.includes("@")) return "email";
            else if (/^\d{7,15}$/.test(value)) return "tel";
        }
        return "text";
    }
    
    const fields = useMemo(() => {
        return Object.entries(data)
            .filter(([key]) => !key.endsWith("_id"))
            .map(([key, value]) => ({
                key,
                value,
                type: selectOptions[key] ? "select" : detectType(key, value),
                options: selectOptions[key] || []
            })
        );
    }, [data]);

    const onChange = (key, newValue) => {
        setData((prev) => ({
        ...prev,
        [key]: newValue
        }));
    };

    const handleCancel = () => {
        // Restore editable data back to original
        setData({ ...originalData });
    };

    return (
        <div className="App-Form">
            <div className="App-Form-Header">
                <button
                className="btn btn-secondary"
                onClick={handleCancel}
                >
                    Revert
                </button>
                <h1>{fields.length > 0 ? title : "None Selected"}</h1>
                <button
                className="btn btn-primary"
                onClick={() => onSave(data)}
                >
                    Save
                </button>
            </div>
            
            {fields.map(({ key, value, type, options }) => (
                <div>
                    <label key={key} className="App-Form-Line">
                    <span className="App-Form-Label">{key.replace(/_/g, " ")}</span>
                    {type === "select" ? (
                        <select
                            className="input input-bordered"
                            value={value}
                            onChange={(e) => onChange(key, e.target.value)}
                        >
                            {options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : type === "textarea" ? (
                        <textarea
                            type={type}
                            className="App-Form-Input"
                            value={value ?? ""}
                            onChange={(e) => onChange(key, e.target.value)}
                        />
                    ) : type === "checkbox" ? (
                        <input
                            type={type}
                            className="App-Form-Input"
                            checked={value}
                            onChange={(e) => onChange(key, e.target.checked)}
                        />
                    ): (
                        <input
                            type={type}
                            className="App-Form-Input"
                            value={value ?? ""}
                            onChange={(e) => onChange(key, e.target.value)}
                        />
                    )}
                    </label>
                    <br />
                </div>
            ))}
        </div>
    );
}

export default Form_Edit;