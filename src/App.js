import React, { useEffect, useState } from "react";
import Multiselect from "./Multiselect";
import "./App.css";

function App() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch("http://109.67.155.6:8091/api/Timezones")
      .then((response) => response.json())
      .then((data) => {
        const formatted = data.map((zone, index) => ({
          label: zone,
          value: index,
        }));
        setOptions(formatted);
      })
      .catch((error) => console.error("Error fetching time zones:", error));
  }, []);

  return (
    <div className="app">
      <h1>Select a time zone</h1>
      <Multiselect
        options={options}
        selectedOptions={selected}
        onSelectionChange={setSelected}
        placeholder="Choose your time zone(s)"
      />
      {selected.length > 0 ? (
        <p>
          Selected options:{" "}
          {selected.map((el) => `${el.label} (${el.value})`).join(", ")}.
        </p>
      ) : (
        <p>No options selected.</p>
      )}
    </div>
  );
}

export default App;
