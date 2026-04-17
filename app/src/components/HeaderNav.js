import React, { useState } from "react";

function HeaderNav({ role, onNavClick }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleClick = (label) => {
    onNavClick(label);
    setOpenMenu(null);
  };

  return (
    <nav style={styles.nav}>
      {role === "finance" ? (
        <>
          {/* Dropdown 1 */}
          <div style={styles.dropdown}>
            <button style={styles.button} onClick={() => toggleMenu("menu1")}>
              Finance
            </button>
            {openMenu === "menu1" && (
              <div style={styles.menu}>
                <div style={styles.item} onClick={() => handleClick("billings")}>Billing</div>
              </div>
            )}
          </div>
        </>

      ) : role === "teacher" ? (
        <>
          {/* Dropdown 2 */}
          <div style={styles.dropdown}>
            <button style={styles.button} onClick={() => toggleMenu("menu2")}>
              Teacher
            </button>
            {openMenu === "menu2" && (
              <div style={styles.menu}>
                <div style={styles.item} onClick={() => handleClick("teacherportal")}>Portal</div>
              </div>
            )}
          </div>
        </>
      ) : role === "admin" ? (
        <>
          {/* Dropdown 3 */}
          <div style={styles.dropdown}>
            <button style={styles.button} onClick={() => toggleMenu("menu3")}>
              Admin
            </button>
            {openMenu === "menu3" && (
              <div style={styles.menu}>
                <div style={styles.item} onClick={() => handleClick("terms")}>Terms</div>
                <div style={styles.item} onClick={() => handleClick("courses")}>Courses</div>
                <div style={styles.item} onClick={() => handleClick("assignments")}>Assignments</div>
                <div style={styles.item} onClick={() => handleClick("teachers")}>Teachers</div>
                <div style={styles.item} onClick={() => handleClick("students")}>Students</div>
                <div style={styles.item} onClick={() => handleClick("term_courses")}>Term Courses</div>
                
                <div style={styles.subMenu}>
                  <div style={styles.subItem} onClick={() => handleClick("assignments2course")}>
                    Assignments To Course
                  </div>
                </div>

                <div style={styles.subMenu}>
                  <div style={styles.subItem} onClick={() => handleClick("courses2term")}>
                    Courses To Term
                  </div>
                </div>
                
                <div style={styles.subMenu}>
                  <div style={styles.subItem} onClick={() => handleClick("students2course")}>
                    Students To Course
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </>
      ) : (
        "Incorrect Role"
      )}

      {/* About Link */}
      <div
        style={styles.button}
        onClick={() => handleClick("about")}
      >
        About
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "20px",
    padding: "10px",
    background: "#282c34",
    alignItems: "center",
    position: "relative"
  },
  dropdown: {
    position: "relative"
  },
  button: {
    background: "#282c34",
    border: "1px solid white",
    padding: "6px 6px",
    cursor: "pointer",
    color: "white"
  },
  menu: {
    position: "absolute",
    fontSize: 20,
    top: "35px",
    left: 0,
    background: "#282c34",
    border: "1px solid white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 10
  },
  item: {
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "white",
    textAlign: "left"
  },
  link: {
    cursor: "pointer",
    padding: "6px 10px",
    color: "white"
  },
  itemWithChildren: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  subMenu: {
    paddingLeft: "30px",
    paddingRight: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    textAlign: "left"
  },
  subItem: {
    cursor: "pointer",
    color: "#c5c5c5",
    padding: "4px 0",
    textAlign: "left"
  }
};
 export default HeaderNav;