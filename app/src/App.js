import { useState } from "react";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Courses from "./components/Courses";
import Billings from "./components/Billings";
import './App.css';

function App() {

    const [pageView, setPageView] = useState("classes");

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
          ) :  pageView === "students" ? (
            <Students />
          ) :  pageView === "teachers" ? (
            <Teachers />
          ) :  pageView === "classes" ? (
            <Courses />
          ) :  pageView === "billings" ? (
            <Billings />
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
