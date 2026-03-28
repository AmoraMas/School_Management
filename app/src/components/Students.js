import { useState } from "react";
import { useEffect } from "react";

import TableHead from "./Table-Head";
import TableBody from "./Table-Body";

function Students() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { label: "Student ID", accessor: "student_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Date Of Birth", accessor: "date_of_birth" },
    { label: "Email", accessor: "email" },
    { label: "Phone", accessor: "phone" },
    { label: "Address", accessor: "address" },
    { label: "Enrollment Date", accessor: "enrollment_date" },
    { label: "Status", accessor: "student_status" }
  ];
  const tempdata = [
    {
        "student_id":	1,
        "first_name":	"Lyiondra",
        "last_name":	"Bradley",
        "date_of_birth":	"2000-01-01",
        "email":	"first.last@nowhere.com",
        "phone":	"(123)456-7890",
        "address":	"111 NoWhere Street - Nowhere AL 00000",
        "enrollment_date":	"2023-01-01",
        "student_status":	"active"
    }, {
        "student_id":	2,
        "first_name":	"Alyssa",
        "last_name":	"Brown",
        "date_of_birth":	"2000-01-01",
        "email":	"first.last@nowhere.com",
        "phone":	"(123)456-7890",
        "address":	"111 NoWhere Street - Nowhere AL 00000",
        "enrollment_date":	"2023-01-01",
        "student_status":	"active"
    }
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
        setData(fetchData);
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
        <div className="Table">
            <table className="App-Table">
                <caption>
                    List of Students
                </caption>
                <TableHead columns={columns} />
                <TableBody columns={columns} data={data} />
            </table>
        </div>
    )
}

export default Students;