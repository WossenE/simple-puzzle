// App.tsx
import { useState } from "react";
import "./App.css";
import SlidePuzzle from "./SlidePuzzle";
import RowsColsInput from "./RowsColsInput";

function App() {
  const [rowsCols, setRowsCols] = useState<number | undefined>();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Puzzle Challenge</h1>
        {!rowsCols ? (
          <RowsColsInput setRowsCols={setRowsCols} />
        ) : (
          <SlidePuzzle rowsCols={rowsCols} />
        )}
      </header>
    </div>
  );
}

export default App;
