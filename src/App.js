// import { useEffect, useState } from "react";
// import { loadWords } from "./wordle.js";
import "./App.css";
import WordleHelper from "./wordleHelper.js";

function App() {
  // const [words, setWords] = useState([]);
  // const [filtered, setFiltered] = useState([]);

  // useEffect(() => {
  //   loadWords().then(({filtered}) => {
  //     //setWords(words);
  //     setFiltered(filtered);
  //   });
  // }, []);

  return (
    <div className="App">
      <div>
        <WordleHelper/>
        {/* <WordleHelper/> */}
      </div>
    </div>
  );
}

export default App;