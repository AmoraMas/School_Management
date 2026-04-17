import { useState, useImperativeHandle, forwardRef } from "react";

const Popup_Date = forwardRef(({ onDateSelected, defaultValue }, ref) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Expose open() to parent
  useImperativeHandle(ref, () => ({
    open: () => {
      setValue(defaultValue || "");   // load default when opened
      setOpen(true);
    }
  }));

  const close = () => setOpen(false);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Select a Date</h3>

        <input
          type="date"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onDateSelected?.(e.target.value);
            close();
          }}
          style={inputStyle}
        />

        <div style={buttonRow}>
            <button
                onClick={() => {
                onDateSelected?.(value);
                close();
                }}
                style={okButton}
            >
                OK
            </button>

            <button onClick={close} style={cancelButton}>
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
});

export default Popup_Date;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "260px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "12px 0",
  fontSize: "16px"
};

const buttonRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px"
};

const okButton = {
  padding: "8px 16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px"
};

const cancelButton = {
  padding: "8px 16px",
  backgroundColor: "#ccc",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px"
};
