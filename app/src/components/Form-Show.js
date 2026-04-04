import { useEffect } from "react";
import { useState } from "react";

function Form_Show({ title, rawData }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (!rawData) return;

    function detectType(key, value) {
        if (key.includes("date")) return "date";
        else if (key.includes("email")) return "email";
        else if (key.includes("phone")) return "tel";
        else if (key.includes("description")) return "textarea";
        else if (typeof value === "number") return "number";
        else if (typeof value === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "date";
            else if (value.includes("@")) return "email";
            else if (/^\d{7,15}$/.test(value)) return "tel";
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
      <caption>{fields.length > 0 ? title : "None Selected"}</caption>

      {fields.map(({ key, value, type }) => (
        <div>
            <label key={key} className="App-Form-Line">
            <span className="App-Form-Label">
                {key.replace(/_/g, " ")}
            </span>
            {type === "textarea" ? (
                <textarea
                    type={type}
                    className="App-Form-Input"
                    value={value ?? ""}
                    readOnly
                />
            ) : (
              <input
                  type={type}
                  value={value ?? ""}
                  readOnly
                  className="App-Form-Input"
              />
              )}
            </label>
            <br />
        </div>
      ))}
    </div>
  );
}

export default Form_Show;