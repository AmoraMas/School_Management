import { useEffect } from "react";
import { useState } from "react";

function Form_Show({ rawData }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (!rawData) return;

    function detectType(key, value) {
        if (typeof value === "number") return "number";
        if (typeof value === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date";
            if (value.includes("@")) return "email";
            if (/^\d{7,15}$/.test(value)) return "tel";
        }
        return "text";
    }

    const newFields = Object.entries(rawData)
      .filter(([key]) => !key.endsWith("_id"))
      .map(([key, value]) => ({
        type: detectType(key, value),
        key,
        value
      }));

    setFields(newFields);
  }, [rawData]);

  return (
    <div className="App-Form">
      <h1>Unedited Values</h1>

      {fields.map(({ key, value, type }) => (
        <div>
            <label key={key} className="App-Form-Line">
            <span className="App-Form-Label">
                {key.replace(/_/g, " ")}
            </span>

            <input
                type={type}
                value={value ?? ""}
                readOnly
                className="App-Form-Input"
            />
            </label>
            <br />
        </div>
      ))}
    </div>
  );
}

export default Form_Show;