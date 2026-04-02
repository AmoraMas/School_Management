import { useState } from "react";
import { useEffect } from "react";

import Table from "./Table";
import Form_Edit from "./Form-Edit";
import Form_Show from "./Form-Show";

function Students() {

  const [Students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState([]);
  const [studentID, setStudentID] = useState(0);

  const table_headers = [
    { label: "Student ID", accessor: "student_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Email", accessor: "email" },
    { label: "Enrollment Date", accessor: "enrollment_date" },
    { label: "Status", accessor: "student_status" }
  ]

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/Students`
        );
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const fetchData = await response.json();
        setStudents(fetchData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
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
        setStudent(Students.find(s => s.student_id === id))
        setStudentID(id)
    }

    const handleFormSave = (value) => {
        const update = diffObjects(value, Students.find(s => s.student_id === value.id))
        fetch('${process.env.REACT_APP_API}/Students?student_id=${value.id}', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'appliation/json'
            },
            body: JSON.stringify(update)
        })
    };

    return (
        <div>
            <div className="App-Table">
                <div className="wrapper">
                    <table className="Table">
                        <caption>
                            List of Students
                        </caption>
                        <Table columns={table_headers} data={Students} idField="student_id" onSelect={handleTableSelect}/>
                    </table>
                </div>
            </div>
            <div className="App-Form-Outer">
                {!student ? (
                    <div>...No Student Selected...</div>
                ) : (
                    <div>
                        <Form_Show rawData={student} />
                        <Form_Edit rawData={student} onSave={handleFormSave} />
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Students;