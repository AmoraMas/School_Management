import React, { useState } from "react";

function HeaderNav({ onNavClick }) {
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
      {/* Dropdown 1 */}
      <div style={styles.dropdown}>
        <button style={styles.button} onClick={() => toggleMenu("menu1")}>
          Teacher Portal
        </button>
        {openMenu === "menu1" && (
          <div style={styles.menu}>
            <div style={styles.item} onClick={() => handleClick("teacherportal")}>Portal</div>
          </div>
        )}
      </div>

      {/* Dropdown 2 */}
      <div style={styles.dropdown}>
        <button style={styles.button} onClick={() => toggleMenu("menu2")}>
          Admin Portal
        </button>
        {openMenu === "menu2" && (
          <div style={styles.menu}>
            <div style={styles.item} onClick={() => handleClick("billings")}>Billing</div>
            <div style={styles.item} onClick={() => handleClick("terms")}>Terms</div>
            <div style={styles.item} onClick={() => handleClick("teachers")}>Teachers</div>
            <div style={styles.item} onClick={() => handleClick("courses")}>Courses</div>
            <div style={styles.subMenu}>
              <div style={styles.subItem} onClick={() => handleClick("courses2term")}>
                To Term
              </div>
            </div>
            <div style={styles.item} onClick={() => handleClick("students")}>Students</div>
            <div style={styles.subMenu}>
              <div style={styles.subItem} onClick={() => handleClick("students2course")}>
                To Course
              </div>
            </div>
            <div style={styles.item} onClick={() => handleClick("assignments")}>Assignments</div>
            <div style={styles.subMenu}>
              <div style={styles.subItem} onClick={() => handleClick("assignments2course")}>
                To Course
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Link */}
      <div
        style={styles.link}
        onClick={() => handleClick("About")}
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
    padding: "6px 10px",
    cursor: "pointer",
    color: "white"
  },
  menu: {
    position: "absolute",
    top: "35px",
    left: 0,
    background: "#282c34",
    border: "1px solid white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 10
  },
  item: {
    padding: "8px 12px",
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
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    textAlign: "left"
  },
  subItem: {
    cursor: "pointer",
    color: "grey",
    padding: "4px 0",
    textAlign: "left"
  }
};
 export default HeaderNav;