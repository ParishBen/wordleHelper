//import fs from React;

// const fs = require("fs");

// const data = fs.readFileSync("../public/words_alpha.txt", "utf8");
// export const words = data.split(/\r?\n/);
// console.log(data);
// export const filtered = words.filter(w => w.length === 5);

//  console.log("total: "+words.length+" filtered length: "+filtered.length);

export async function loadWords() {
  const response = await fetch("/words_alpha.txt");
  const text = await response.text();
  const words = text.split(/\r?\n/);
  const filtered = words.filter(w => w.length === 5);
  //return { words, filtered };
  return {filtered};
}
