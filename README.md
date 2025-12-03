WordleHelper
WordleHelper is a React-based tool designed to help players analyze and filter potential Wordle solutions. It allows users to enter known letters, excluded letters, positional constraints, and other filtering options to quickly narrow down valid five-letter words.

🚀 Features

✅ Dynamic Letter Filtering
Select letters that must appear in the solution (confirmed letters).
Select letters that are eliminated.
Set positional letters (index 1–5).
Specify exempt letters per position to match Wordle’s yellow tile logic.

✅ Smart State Synchronization
Changing any positional letter automatically updates the confirmedLetters list.
Exempt letters at each index also sync into confirmedLetters (no duplicates).
Buttons allow removal of:
confirmed letters
eliminated letters
positional letters
exempt letters

✅ Automatic Word Matching
The helper filters the dictionary of 5-letter words by applying:
🟩 Correct letters at fixed positions
🟨 Exempt (yellow) letters per index
⬛ Eliminated (gray) letters
🔤 Required confirmed letters
All rules are enforced together to avoid contradictions, returning only valid matches.

✅ User Controls
Reset buttons for:
All index details
Individual positional letters
Individual exempt letters
Each letter category displays removable “chips” or buttons for easy updates.

🛠 Tech Stack
React (Functional Components + Hooks)
JavaScript
Bootstrap for layout and styling
Custom helper functions for advanced Wordle-style filtering logic