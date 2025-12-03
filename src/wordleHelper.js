import React, { useState, useEffect, useCallback } from "react";
// Make sure to import `filtered` from wherever it lives in your project:
import { loadWords } from "./wordle.js"; // <- adjust path as needed

export default function WordleHelper() {
  // Index letter states (single char or "")
  const [indexOne, setIndexOne] = useState("");
  const [indexTwo, setIndexTwo] = useState("");
  const [indexThree, setIndexThree] = useState("");
  const [indexFour, setIndexFour] = useState("");
  const [indexFive, setIndexFive] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Exempt arrays for each index (arrays of uppercase letters)
  const [indexOneExempt, setIndexOneExempt] = useState([]);
  const [indexTwoExempt, setIndexTwoExempt] = useState([]);
  const [indexThreeExempt, setIndexThreeExempt] = useState([]);
  const [indexFourExempt, setIndexFourExempt] = useState([]);
  const [indexFiveExempt, setIndexFiveExempt] = useState([]);

  // eliminated letters (array of uppercase letters)
  const [eliminatedLetters, setEliminatedLetters] = useState([]);

  // NEW: confirmed letters (array of uppercase letters)
  const [confirmedLetters, setConfirmedLetters] = useState([]);

  // filteredMatches initially "" (per your spec). Will become array when computed.
  const [filteredMatches, setFilteredMatches] = useState([]);

  // Utility: A-Z letters array
  const LETTERS = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Normalize helpers
  const normChar = (c) =>
    typeof c === "string" && c.length ? c.trim().toUpperCase().slice(0, 1) : "";

  // NEW: Effect to sync confirmedLetters with index positions and exempt arrays
  useEffect(() => {
    const newConfirmed = new Set();

    // Add all correct letters from index positions
    [indexOne, indexTwo, indexThree, indexFour, indexFive].forEach((letter) => {
      if (letter) newConfirmed.add(letter.toUpperCase());
    });

    // Add all exempt letters from all positions
    [
      indexOneExempt,
      indexTwoExempt,
      indexThreeExempt,
      indexFourExempt,
      indexFiveExempt,
    ].forEach((exemptArray) => {
      exemptArray.forEach((letter) => newConfirmed.add(letter.toUpperCase()));
    });

    setConfirmedLetters(Array.from(newConfirmed).sort());
  }, [
    indexOne,
    indexTwo,
    indexThree,
    indexFour,
    indexFive,
    indexOneExempt,
    indexTwoExempt,
    indexThreeExempt,
    indexFourExempt,
    indexFiveExempt,
  ]);

  // Handler for known letter inputs (accept A-Z or ?). If "?" or invalid -> keep state as ""
  const handleKnownLetterChange = (setter) => (e) => {
    const raw = e.target.value || "";
    const ch = raw.trim().toUpperCase().slice(0, 1) || "";
    if (ch === "?" || ch === "") {
      setter("");
    } else if (ch >= "A" && ch <= "Z") {
      setter(ch);
      // If this letter is in eliminatedLetters, remove it
      setEliminatedLetters((prev) => prev.filter((l) => l !== ch));
    } else {
      // Non A-Z char -> treat as empty
      setter("");
    }
  };

  // Handler for exempt selects (multiple select). setter expects array setter.
  const handleExemptChange = (setter) => (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) =>
      o.value.toUpperCase()
    );
    setter(selected);
    // If any of these letters are in eliminatedLetters, remove them
    setEliminatedLetters((prev) => prev.filter((l) => !selected.includes(l)));
  };

  // Handler for eliminated select (multiple)
  const handleEliminatedChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) =>
      o.value.toUpperCase()
    );
    // Filter out any letters that are in confirmedLetters
    const filtered = selected.filter((letter) => !confirmedLetters.includes(letter));
    setEliminatedLetters(filtered);
  };

  // NEW: Handler for confirmed letters select (multiple)
  const handleConfirmedChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) =>
      o.value.toUpperCase()
    );
    setConfirmedLetters(selected);
  };


  // Remove single eliminated letter via UI button
  const removeEliminatedLetter = (letter) =>
    setEliminatedLetters((prev) => prev.filter((l) => l !== letter));

  // NEW: Individual reset functions for each index position
  const resetIndexOne = () => setIndexOne("");
  const resetIndexTwo = () => setIndexTwo("");
  const resetIndexThree = () => setIndexThree("");
  const resetIndexFour = () => setIndexFour("");
  const resetIndexFive = () => setIndexFive("");

  // NEW: Individual reset functions for each exempt array
  const resetIndexOneExempt = () => setIndexOneExempt([]);
  const resetIndexTwoExempt = () => setIndexTwoExempt([]);
  const resetIndexThreeExempt = () => setIndexThreeExempt([]);
  const resetIndexFourExempt = () => setIndexFourExempt([]);
  const resetIndexFiveExempt = () => setIndexFiveExempt([]);

  // Reset IndexDetails (all index known letters and exempt arrays)
  const resetIndexDetails = () => {
    setIndexOne("");
    setIndexTwo("");
    setIndexThree("");
    setIndexFour("");
    setIndexFive("");
    setIndexOneExempt([]);
    setIndexTwoExempt([]);
    setIndexThreeExempt([]);
    setIndexFourExempt([]);
    setIndexFiveExempt([]);
    setEliminatedLetters([]);
  };

  // Reset eliminated
  const resetEliminated = () => setEliminatedLetters([]);

  // Core matching logic (computes filteredMatches based on current states)
  const computeFilteredMatches = useCallback(() => {
    // Check if any filtering criteria has been set
    const hasIndexLetters = indexOne || indexTwo || indexThree || indexFour || indexFive;
    const hasExemptLetters = 
      indexOneExempt.length > 0 ||
      indexTwoExempt.length > 0 ||
      indexThreeExempt.length > 0 ||
      indexFourExempt.length > 0 ||
      indexFiveExempt.length > 0;
    const hasEliminatedLetters = eliminatedLetters.length > 0;
    const hasConfirmedLetters = confirmedLetters.length > 0;

    // If no criteria set, don't compute matches
    if (!hasIndexLetters && !hasExemptLetters && !hasEliminatedLetters && !hasConfirmedLetters) {
      setFilteredMatches([]);
      return;
    }

    // Ensure working on uppercase and do not mutate `filtered`
    const source = Array.isArray(filtered) ? filtered : [];


    // Normalize source to uppercase 5-letter words only
    const normalized = source
      .filter((w) => typeof w === "string")
      .map((w) => w.toUpperCase())
      .filter((w) => w.length === 5);

    // Build index exacts and exempts arrays for easier iteration
    const exacts = [indexOne, indexTwo, indexThree, indexFour, indexFive].map(
      (v) => (v ? v.toUpperCase() : "")
    );
    const exempts = [
      indexOneExempt,
      indexTwoExempt,
      indexThreeExempt,
      indexFourExempt,
      indexFiveExempt,
    ].map((arr) => (Array.isArray(arr) ? arr.map((x) => x.toUpperCase()) : []));

    const eliminatedSet = new Set(
      (Array.isArray(eliminatedLetters) ? eliminatedLetters : []).map((l) =>
        l.toUpperCase()
      )
    );

    // NEW: Create a set of confirmed letters that must be in the word
    const confirmedSet = new Set(
      (Array.isArray(confirmedLetters) ? confirmedLetters : []).map((l) =>
        l.toUpperCase()
      )
    );

    // Filtering step:
    // 1) If exact char present for position i -> require word[i] === exact
    // 2) If exact missing for position i but exempts present -> word[i] must NOT be any exempt letters
    // 3) Exclude any word containing any letter in eliminatedLetters (anywhere)
    // 4) NEW: Ensure word contains ALL letters in confirmedLetters
    const results = normalized.filter((word) => {
      // check exacts/exempts per index
      for (let i = 0; i < 5; i++) {
        const exact = exacts[i];
        const exList = exempts[i] || [];

        const ch = word.charAt(i);
        if (exact) {
          if (ch !== exact) return false;
        } else if (exList && exList.length > 0) {
          // if the index has no known exact, then rule out words that have exempt letters in that position
          if (exList.includes(ch)) return false;
        }
      }

      // exclude words containing ANY eliminated letter
      for (const e of eliminatedSet) {
        if (!e) continue;
        if (word.includes(e)) return false;
      }

      // NEW: ensure word contains ALL confirmed letters
      for (const c of confirmedSet) {
        if (!c) continue;
        if (!word.includes(c)) return false;
      }

      return true;
    });

    // Update filteredMatches
    // Per spec, do not mutate original filtered; we don't.
    setFilteredMatches(results);
  }, [
    indexOne,
    indexTwo,
    indexThree,
    indexFour,
    indexFive,
    indexOneExempt,
    indexTwoExempt,
    indexThreeExempt,
    indexFourExempt,
    indexFiveExempt,
    eliminatedLetters,
    confirmedLetters,
    filtered,
  ]);

  // Recompute whenever index/exempt/eliminated/confirmed state changes
  useEffect(() => {
    computeFilteredMatches();
  }, [computeFilteredMatches]);

  //Get the filtered array of 5 letter words;
  useEffect(() => {
    loadWords().then(({ filtered }) => {
      setFiltered(filtered);
    });
  }, []);

  // Small helper to render a single worldle box (display-only input)
  const renderWorldleBox = (value) => {
    const hasLetter = typeof value === "string" && value.length === 1;
    const classes = [
      "form-control",
      "text-center",
      "mx-1",
      "d-inline-block",
      "fw-bold",
    ].join(" ");

    const style = {
      width: 60,
      height: 60,
      lineHeight: "60px",
      display: "inline-block",
      fontSize: "1.5rem",
      backgroundColor: hasLetter ? "#28a745" : "#e9ecef",
      color: hasLetter ? "#fff" : "#000",
      borderRadius: 6,
      border: "1px solid #ccc",
      verticalAlign: "middle",
    };

    return (
      <div style={style} className={classes} aria-readonly="true" role="textbox">
        {hasLetter ? value.toUpperCase() : ""}
      </div>
    );
  };

  return (
    <div className="container my-4 p-4 border rounded">
      {/* WORLDE form (display-only 5 boxes centered horizontally) */}
      <div className="mb-6">
        <h3 className="text-center">Worldle Hero</h3>
        <div className="d-flex justify-content-center align-items-center my-2 mb-4">
          {renderWorldleBox(indexOne)}
          {renderWorldleBox(indexTwo)}
          {renderWorldleBox(indexThree)}
          {renderWorldleBox(indexFour)}
          {renderWorldleBox(indexFive)}
        </div>
      </div>

      {/* Eliminated form */}
      <div className="mb-4 offset-md-2">
        <div className="row">
          <div className="col-md-6">
        <h5 className="pt-2"><strong>Eliminated Letters</strong> (select multiple by holding down CTR/Command)</h5>
        </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <select
              multiple
              className="form-control"
              value={eliminatedLetters}
              onChange={handleEliminatedChange}
              aria-label="Eliminated letters"
              style={{ height: 160 }}
            >
              {LETTERS.map((L) => (
                <option key={L} value={L}>
                  {L}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={resetEliminated}
                type="button"
              >
                Reset Eliminated
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Selected eliminated letters</label>
            <div>
              {eliminatedLetters.length === 0 && (
                <div className="text-muted">No eliminated letters selected</div>
              )}
              {eliminatedLetters.map((L) => (
                <button
                  key={L}
                  type="button"
                  className="btn btn-sm btn-outline-danger me-2 mb-2"
                  onClick={() => removeEliminatedLetter(L)}
                >
                  {L} &times;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Confirmed Letters form */}
      {/* <div className="mb-4">
        <h5>Word Contains Following Letters (select multiple by holding down CTR/Command)</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              multiple
              className="form-control"
              value={confirmedLetters}
              onChange={handleConfirmedChange}
              aria-label="Confirmed letters"
              style={{ height: 160 }}
            >
              {LETTERS.map((L) => (
                <option key={L} value={L}>
                  {L}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={resetConfirmed}
                type="button"
              >
                Reset Confirmed
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Selected confirmed letters</label>
            <div>
              {confirmedLetters.length === 0 && (
                <div className="text-muted">No confirmed letters selected</div>
              )}
              {confirmedLetters.map((L) => (
                <button
                  key={L}
                  type="button"
                  className="btn btn-sm btn-outline-success me-2 mb-2"
                  onClick={() => removeConfirmedLetter(L)}
                >
                  {L} &times;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* IndexDetails form */}
      <div className="mb-4">
        <h2 className="text-center">Let's crack this word!</h2>

        {/* We'll render 5 formGroups in pairs (10 inputs) */}
        <div className="row">
          {/* indexOne group */}
          <div className="col-md-6 mb-3">
            <div className="card p-2">
              <div className="mb-2">
                <label className="form-label">First Letter - Correct Letter</label>
                <input
                  className="form-control"
                  value={indexOne}
                  onChange={handleKnownLetterChange(setIndexOne)}
                  maxLength={1}
                  placeholder="A-Z"
                />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexOne}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div>
                <label className="form-label">
                  Confirmed Letter(s) but Invalid in this Position (hold down CTR/Command to select multiple)
                </label>
                <select
                  multiple
                  className="form-control"
                  value={indexOneExempt}
                  onChange={handleExemptChange(setIndexOneExempt)}
                  style={{ height: 120 }}
                >
                  {LETTERS.map((L) => (
                    <option key={L} value={L}>
                      {L}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexOneExempt}
                  type="button"
                >
                  Reset Exempt
                </button>
                <div className="mt-2">
                  <label className="form-label">Confirmed letters - Other position(s)</label>
                  <div>
                    {indexOneExempt.length === 0 && (
                      <div className="text-muted">No exempt letters selected</div>
                    )}
                    {indexOneExempt.map((L) => (
                      <span
                        key={L}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {L}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* indexTwo group */}
          <div className="col-md-6 mb-3">
            <div className="card p-2">
              <div className="mb-2">
                <label className="form-label">Second Letter - Correct Letter</label>
                <input
                  className="form-control"
                  value={indexTwo}
                  onChange={handleKnownLetterChange(setIndexTwo)}
                  maxLength={1}
                  placeholder="A-Z"
                />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexTwo}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div>
                <label className="form-label">
                  Confirmed Letter(s) but Invalid in this Position (hold down CTR/Command to select multiple)
                </label>
                <select
                  multiple
                  className="form-control"
                  value={indexTwoExempt}
                  onChange={handleExemptChange(setIndexTwoExempt)}
                  style={{ height: 120 }}
                >
                  {LETTERS.map((L) => (
                    <option key={L} value={L}>
                      {L}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexTwoExempt}
                  type="button"
                >
                  Reset Exempt
                </button>
                <div className="mt-2">
                  <label className="form-label">Confirmed letters - Other position(s)</label>
                  <div>
                    {indexTwoExempt.length === 0 && (
                      <div className="text-muted">No exempt letters selected</div>
                    )}
                    {indexTwoExempt.map((L) => (
                      <span
                        key={L}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {L}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* indexThree group */}
          <div className="col-md-6 mb-3">
            <div className="card p-2">
              <div className="mb-2">
                <label className="form-label">Third Letter - Correct Letter</label>
                <input
                  className="form-control"
                  value={indexThree}
                  onChange={handleKnownLetterChange(setIndexThree)}
                  maxLength={1}
                  placeholder="A-Z"
                />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexThree}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div>
                <label className="form-label">
                  Confirmed Letter(s) but Invalid in this Position (hold down CTR/Command to select multiple)
                </label>
                <select
                  multiple
                  className="form-control"
                  value={indexThreeExempt}
                  onChange={handleExemptChange(setIndexThreeExempt)}
                  style={{ height: 120 }}
                >
                  {LETTERS.map((L) => (
                    <option key={L} value={L}>
                      {L}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexThreeExempt}
                  type="button"
                >
                  Reset Exempt
                </button>
                <div className="mt-2">
                  <label className="form-label">Confirmed letters - Other position(s)</label>
                  <div>
                    {indexThreeExempt.length === 0 && (
                      <div className="text-muted">No exempt letters selected</div>
                    )}
                    {indexThreeExempt.map((L) => (
                      <span
                        key={L}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {L}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* indexFour group */}
          <div className="col-md-6 mb-3">
            <div className="card p-2">
              <div className="mb-2">
                <label className="form-label">Fourth Letter - Correct Letter</label>
                <input
                  className="form-control"
                  value={indexFour}
                  onChange={handleKnownLetterChange(setIndexFour)}
                  maxLength={1}
                  placeholder="A-Z"
                />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexFour}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div>
                <label className="form-label">
                  Confirmed Letter(s) but Invalid in this Position (hold down CTR/Command to select multiple)
                </label>
                <select
                  multiple
                  className="form-control"
                  value={indexFourExempt}
                  onChange={handleExemptChange(setIndexFourExempt)}
                  style={{ height: 120 }}
                >
                  {LETTERS.map((L) => (
                    <option key={L} value={L}>
                      {L}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexFourExempt}
                  type="button"
                >
                  Reset Exempt
                </button>
                <div className="mt-2">
                  <label className="form-label">Confirmed letters - Other position(s)</label>
                  <div>
                    {indexFourExempt.length === 0 && (
                      <div className="text-muted">No exempt letters selected</div>
                    )}
                    {indexFourExempt.map((L) => (
                      <span
                        key={L}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {L}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* indexFive group */}
          <div className="col-md-6 mb-3 offset-md-3">
            <div className="card p-2">
              <div className="mb-2">
                <label className="form-label">Fifth Letter - Correct Letter</label>
                <input
                  className="form-control"
                  value={indexFive}
                  onChange={handleKnownLetterChange(setIndexFive)}
                  maxLength={1}
                  placeholder="A-Z"
                />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexFive}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div>
                <label className="form-label">
                  Confirmed Letter(s) but Invalid in this Position (hold down CTR/Command to select multiple)
                </label>
                <select
                  multiple
                  className="form-control"
                  value={indexFiveExempt}
                  onChange={handleExemptChange(setIndexFiveExempt)}
                  style={{ height: 120 }}
                >
                  {LETTERS.map((L) => (
                    <option key={L} value={L}>
                      {L}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={resetIndexFiveExempt}
                  type="button"
                >
                  Reset Exempt
                </button>
                <div className="mt-2">
                  <label className="form-label">Confirmed letters - Other position(s)</label>
                  <div>
                    {indexFiveExempt.length === 0 && (
                      <div className="text-muted">No exempt letters selected</div>
                    )}
                    {indexFiveExempt.map((L) => (
                      <span
                        key={L}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {L}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={resetIndexDetails}
            type="button"
          >
            RESET ALL
          </button>
        </div>
      </div>

      {/* Display filteredMatches */}
      <div className="mb-4">
        <h5>Solutions Lair</h5>
        <div className="card p-2">
          {filteredMatches.length === 0 ? (
            <div className="text-muted">
              No matches computed yet
            </div>
          ) : (
            <div className="d-flex flex-wrap">
              {filteredMatches.map((w) => (
                <div
                  key={w}
                  className="badge rounded-pill bg-light text-dark me-2 mb-2 p-2"
                >
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}