import { useState } from "react";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Courses from "./components/Courses";
import Billings from "./components/Billings";
import Terms from "./components/Terms";
import Assignments from "./components/Assignments";
import Connect_Tables from "./components/Connect-Tables";
import './App.css';

function App() {

    const [pageView, setPageView] = useState("courses");

    const handlePageChange = (page) => {
        setPageView(page);
    }

  return (
    <div className="App">
      <div className="App-Inner">
        <Header handlePage={handlePageChange}/>

        <div className="App-Body">
          {!pageView ? (
            <caption>...No Page Selected...</caption>
          ) : pageView === "students" ? (
            <Students />
          ) : pageView === "teachers" ? (
            <Teachers />
          ) : pageView === "courses" ? (
            <Courses />
          ) : pageView === "billings" ? (
            <Billings />
          ) : pageView === "terms" ? (
            <Terms />
          ) : pageView === "assignments" ? (
            <Assignments />
          ) : pageView === "courses2term" ? (
            <Connect_Tables one="Terms" many="Courses" one_id="term_id" many_id="course_id" connected="Term_Courses" connected_id="term_course_id" />
          ) : pageView === "students2course" ? (
            <Connect_Tables one="Term_Courses" many="Students" one_id="term_course_id" many_id="student_id" connected="Student_Course_Enrollments" connected_id="enrollment_id" />
          ) : pageView === "assignments2course" ? (
            <Connect_Tables one="Term_Courses" many="Assignments" one_id="term_course_id" many_id="assignment_id" connected="Student_Course_Assignment_Grades" connected_id="grade_id" />
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
