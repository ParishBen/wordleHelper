import { useEffect, useState } from "react";
import { loadWords } from "./wordle.js";
import WordleHelper from "./wordleHelper.js";

function App() {
  const [words, setWords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    loadWords().then(({filtered}) => {
      //setWords(words);
      setFiltered(filtered);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/*<p>Total words: {words.length}</p>*/}
        <p>5-letter words: {filtered.length}</p>
      </header>
      <br/>
      <br/>
      <div>
        <WordleHelper/>
        {/* <WordleHelper/> */}
      </div>
      {/* <div><LetterSelector/></div> */}
    </div>
  );
}

export default App;