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
            <Connect_Tables one="Terms" many="Courses" one_id="term_id" many_id="course_id" />
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
