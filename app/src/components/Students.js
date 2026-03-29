import { useState } from "react";
import { useEffect } from "react";

import TableHead from "./Table-Head";
import TableBody from "./Table-Body";
import Form from "./Form";
import FastList from "./Form-FastList";

function Students() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState([]);

  const column_top = [
    { label: "Student ID", accessor: "student_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Email", accessor: "email" },
    { label: "Enrollment Date", accessor: "enrollment_date" },
    { label: "Status", accessor: "student_status" }
  ]

  const column_bot = [
    { label: "Student ID", accessor: "student_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Date Of Birth", accessor: "date_of_birth" },
    { label: "Email", accessor: "email" },
    { label: "Phone", accessor: "phone" },
    { label: "Street", accessor: "street" },
    { label: "City", accessor: "city" },
    { label: "State", accessor: "state" },
    { label: "Country", accessor: "country" },
    { label: "Zip", accessor: "zip" },
    { label: "Enrollment Date", accessor: "enrollment_date" },
    { label: "Status", accessor: "student_status" }
  ];

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
        setData(fetchData);
        setStudent(fetchData[0])
        setError(null);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

    return (
        <div>
            <div className="App-Table">
                <div className="wrapper">
                    <table className="Table">
                        <caption>
                            List of Students
                        </caption>
                        <TableHead columns={column_top} />
                        <TableBody columns={column_top} data={data} />
                    </table>
                </div>
            </div>
            <div className="App-Form-Outer">
                <Form formData={student} />
                <Form formData={student} />
            </div>
        </div>
    )
}

export default Students;