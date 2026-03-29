import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";

function Form({ formData }) {

    const [data, setData] = useState(() => formData);

    const selectOptions = {
        state: [
            "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
            "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
            "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
            "VA","WA","WV","WI","WY"
        ],
        student_status: ["active", "inactive", "suspended", "graduated"],
        teacher_status: ["active", "inactive", "suspended", "retired", "fired"],
        class_status: ["active", "inactive", "dead"],
        billing_status: ["paid", "unpaid","overdue"],
        country: ["USA", "Canada", "Mexico"]
    };


    useEffect(() => {
        if (formData) {
            setData(formData);
        }
    }, [formData]);

    function detectType(key, value) {
        if (typeof value === "number") return "number";
        if (typeof value === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date";
            if (value.includes("@")) return "email";
            if (/^\d{7,15}$/.test(value)) return "tel";
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

    const handleFieldChange = (key, newValue) => {
        setData((prev) => ({
        ...prev,
        [key]: newValue
        }));
    };
        return fields.length > 0 ? (
            <Form_Edit fields={fields} onChange={handleFieldChange} />
        ) : (
            <div>Loading...</div>
        );
}


function Form_Edit({ fields, onChange }) {
    return (
        <div className="App-Form">
            {fields.map(({ key, value, type, options }) => (
                <label key={key} className="App-Form-Line">
                <span className="font-semibold capitalize">{key.replace(/_/g, " ")}</span>
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
                    ) : (
                        <input
                            type={type}
                            className="input input-bordered"
                            value={value ?? ""}
                            onChange={(e) => onChange(key, e.target.value)}
                        />
                    )
                }
                </label>
            ))}
        </div>
    );
}



function EditableStudentForm({ fields, onChange }) {
    return (
        <div className="App-Form">
            {fields.map(({ key, value, type }) => (
                <label key={key} className="App-Form-Line">
                <span className="font-semibold capitalize">{key.replace(/_/g, " ")}</span>
                <input
                    type={type}
                    className="input input-bordered"
                    value={value}
                    onChange={(e) => onChange(key, e.target.value)}
                />
                </label>
            ))}
        </div>
    );
}



export default Form;