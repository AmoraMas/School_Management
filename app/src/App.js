import { useState } from "react";
import { useEffect } from "react";

import './App.css';
import Header from "./components/Header";
import About from "./components/About";
import Footer from "./components/Footer";

import Assignments from "./components/Assignments";
import Billings from "./components/Billings";
import Courses from "./components/Courses";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Terms from "./components/Terms";
import Term_Courses from "./components/Term-Courses";
import Connect_Tables from "./components/Connect-Tables";
import Teacher_Portal from "./components/Teacher-Portal";

function App() {
  const [pageView, setPageView] = useState("");
  const [role, setRole] = useState("teacher");
  const [userID, setUserID] = useState(1);

  const handlePageChange = (page) => {
      setPageView(page);
  }

  useEffect(() => {
    if (role === "admin") {
      setPageView("terms");
    }
    else if (role === "finance") {
      setPageView("billings");
    }
    else if (role === "teacher") {
      setPageView("teacherportal");
    }
    else {
      setPageView("about");
    }
  }, [role])

  return (
    <div className="App">
      <div className="App-Inner">
        <Header role={role} handlePage={handlePageChange}/>

        <div className="App-Body">
          {!pageView ? (
            <caption>...No Page Selected...</caption>
          ) : pageView === "about" ? (
            <About />
          ) : pageView === "students" && role === "admin" ? (
            <Students />
          ) : pageView === "teachers" && role === "admin" ? (
            <Teachers />
          ) : pageView === "courses" && role === "admin" ? (
            <Courses />
          ) : pageView === "billings" && role === "finance" ? (
            <Billings />
          ) : pageView === "terms" && role === "admin" ? (
            <Terms />
          ) : pageView === "assignments" && role === "admin" ? (
            <Assignments />
          ) : pageView === "teacherportal" && role !== "teacher" && !Number.isInteger(userID) ? (
            "Teacher information is incorrect"
          ) : pageView === "teacherportal" && role === "teacher" && Number.isInteger(userID) ? (
            <Teacher_Portal teacherID={userID} />
          ) : pageView === "term_courses" && role === "admin" ? (
            <Term_Courses />
          ) : pageView === "courses2term" && role === "admin" ? (
            <Connect_Tables one="Terms" many="Courses" one_id="term_id" many_id="course_id" combined="Term_Courses" combined_id="term_course_id" />
          ) : pageView === "students2course" && role === "admin" ? (
            <Connect_Tables one="Term_Courses" many="Students" one_id="term_course_id" many_id="student_id" combined="Student_Course_Enrollments" combined_id="enrollment_id" />
          ) : pageView === "assignments2course" && role === "admin" ? (
            <Connect_Tables one="Term_Courses" many="Assignments" one_id="term_course_id" many_id="assignment_id" combined="Student_Course_Assignment_Grades" combined_id="grade_id" />
          ) : (
            <caption>Select an Action</caption>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
