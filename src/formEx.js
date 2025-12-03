import React, { useState } from "react";

export default function LetterSelector() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [selectedLetters, setSelectedLetters] = useState([]);

  const handleChange = (e) => {
    // Convert selected <option> elements to an array of values
    const values = Array.from(e.target.selectedOptions, opt => opt.value);
    setSelectedLetters(values);
  };

  return (
    <div className="container mt-4">
      <label className="form-label fw-bold">Select Letters:</label>

      <select
        multiple
        className="form-select"
        value={selectedLetters}
        onChange={handleChange}
        style={{ height: "200px" }} // so user can see multiple letters
      >
        {alphabet.map(letter => (
          <option key={letter} value={letter}>
            {letter}
          </option>
        ))}
      </select>

      <div className="mt-3">
        <strong>Selected:</strong> {selectedLetters.join(", ") || "None"}
      </div>
    </div>
  );
}