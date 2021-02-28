import React, { useState, useRef, useEffect } from "react";
import "./AddRequest.css";

const AddRequest = ({
  showAddRequest,
  hideAddRequest,
  onAddRequestInputChange,
  colors,
  maxDate,
}) => {
  const [numValue, setNumValue] = useState(0);
  const [dataType, setDataType] = useState("");
  const [dateValue, setDateValue] = useState(maxDate);
  const inputRef = useRef(null);

  const reset = () => {
    setNumValue(0);
    setDataType("");
    setDateValue(maxDate);
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }

    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRequestInputChange(numValue, dateValue, dataType);

    reset();
    hideAddRequest();
  };

  const handleCancel = () => {
    reset();
    hideAddRequest();
  };
  return (
    <div
      className={
        showAddRequest ? "ar-modal display-block" : "ar-modal display-none"
      }
    >
      <div className="ar-modal-main">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="ar-header">Add a new Request</div>
            <label style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", padding: "2px" }}>
                Enter a value:
              </span>
              <input
                type="number"
                value={numValue}
                placeholder="Enter a value"
                ref={inputRef}
                onChange={(val) => setNumValue(val.target.value)}
                pattern="[0-9]{0,5}"
              />
            </label>
            <label>
              <span style={{ fontSize: "12px", padding: "2px" }}>
                Enter a valid date:
              </span>
              <input
                type="date"
                value={dateValue}
                placeholder="Enter a value"
                ref={inputRef}
                onChange={(val) => setDateValue(val.target.value)}
                pattern="[0-9]{0,5}"
              />
            </label>
            <div className="ar-radios">
              {colors.map((c) => (
                <div key={c.color}>
                  <input
                    type="radio"
                    id={c.color}
                    value={c.color}
                    checked={dataType === c.color}
                    name="datatype"
                    onChange={(e) => setDataType(e.target.value)}
                  />
                  <label htmlFor={c.color}>{c.label}</label>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <input type="submit" className="ar-button" value="OK" />
              <button
                className="ar-button"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRequest;
