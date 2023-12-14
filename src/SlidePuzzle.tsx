import {
  CSSProperties,
  ChangeEvent,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";

import { Actions, ActionType, GameStateType, TileDataType } from "./types";
import Tile from "./Tile";
import {
  checkIsSolved,
  copyTilesData,
  generateSoftColor,
  getRandArr,
  getValidNeighbors,
  isSolvable,
} from "./utils";
import DraggableWrapper from "./DraggableWrapper";

const initialGameState: GameStateType = {
  numRowsCols: 4,
  numOfMoves: 0,
  tilesData: null,
  isSolved: true,
  isSolvable: true,
  excludeNonSolvablePermutations: true,
};

// Define the reducer function
const reducer = (state: GameStateType, action: ActionType): GameStateType => {
  const flattened =
    state.tilesData &&
    state.tilesData
      .flat()
      .map((tile) => tile.value)
      .filter((n): n is number => !!n);

  switch (action.type) {
    case Actions.SET_NUM_ROWS_COLS:
      return { ...state, numRowsCols: action.payload.newNumRowsCols };
    case Actions.SET_UP_TILES_DATA:
      return { ...state, tilesData: createTilesData(state.numRowsCols) };
    case Actions.RANDOMIZE_TILES:
      return {
        ...state,
        isSolved: false,
        tilesData: randomizeTiles(
          state.tilesData,
          state.numRowsCols,
          state.excludeNonSolvablePermutations
        ),
      };
    case Actions.MOVE_TILE:
      return {
        ...state,
        numOfMoves: state.numOfMoves + 1,
        tilesData: moveTile(
          state.tilesData,
          action.payload.row,
          action.payload.col,
          state.numRowsCols
        ),
      };
    case Actions.CHECK_IS_SOLEVED:
      return { ...state, isSolved: checkIsSolved(state.tilesData) };
    case Actions.CHECK_IS_SOLEVABLE:
      return { ...state, isSolvable: isSolvable(flattened, state.numRowsCols) };
    case Actions.SET_EXCLUDE_UNSOLVABLE:
      return {
        ...state,
        excludeNonSolvablePermutations: action.payload.excludeUnsolvable,
      };
    default:
      return state;
  }
};

const createTilesData = (numRowsCols: number) => {
  const tilesData = new Array(numRowsCols)
    .fill(null)
    .map((_) => new Array(numRowsCols).fill(null));

  for (let row = 0; row < numRowsCols; row += 1) {
    for (let col = 0; col < numRowsCols; col += 1) {
      tilesData[row][col] = {
        value: row * numRowsCols + col + 1,
        color: generateSoftColor(),
      };
    }
  }

  // The last tile should be empty
  tilesData[numRowsCols - 1][numRowsCols - 1].value = null;
  tilesData[numRowsCols - 1][numRowsCols - 1].color = "#fff";

  return tilesData;
};

const randomizeTiles = (
  tilesData: TileDataType[][] | null,
  numRowsCols: number,
  excludeNonSolvablePermutations: boolean
): TileDataType[][] | null => {
  if (!tilesData) {
    return null;
  }

  let randArr = getRandArr(numRowsCols);
  // An example that is not solvable
  // const randArr =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 13, 14, 12];

  while (!isSolvable(randArr, numRowsCols) && excludeNonSolvablePermutations) {
    randArr = getRandArr(numRowsCols);
  }

  const tilesDataCopy = copyTilesData(tilesData);

  for (let row = 0; row < numRowsCols; row += 1) {
    for (let col = 0; col < numRowsCols; col += 1) {
      if (row === numRowsCols - 1 && col === numRowsCols - 1) {
        continue;
      }
      const tile = tilesDataCopy[row][col];
      tile.value = randArr[row * numRowsCols + col];
      tile.color = generateSoftColor();
    }
  }

  return tilesDataCopy;
};

const moveTile = (
  tilesData: TileDataType[][] | null,
  row: number,
  col: number,
  numRowsCols: number
) => {
  if (!tilesData) {
    return null;
  }

  const neighbors = getValidNeighbors({ row, col }, numRowsCols);
  const emptyTileIndices = neighbors.filter(
    ([row, col]) => tilesData[row][col].value === null
  )[0];

  if (emptyTileIndices === undefined) {
    return tilesData;
  }

  const [emptyTileRow, emptyTileCol] = emptyTileIndices;

  const tilesDataCopy = copyTilesData(tilesData);

  // swap
  const temp = tilesDataCopy[emptyTileRow][emptyTileCol];
  tilesData[emptyTileRow][emptyTileCol] = tilesData[row][col];
  tilesData[row][col] = temp;

  return tilesDataCopy;
};

// ******
function SlidePuzzle() {
  const [gameState, dispatch] = useReducer(reducer, initialGameState);
  const puzzleGridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);

  useEffect(() => {
    const updateGridWidth = () => {
      if (puzzleGridRef.current) {
        setGridWidth(puzzleGridRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", updateGridWidth);
    window.addEventListener("load", updateGridWidth);

    if (puzzleGridRef.current) {
      setGridWidth(puzzleGridRef.current.clientWidth);
    }
    return () => {
      window.removeEventListener("resize", updateGridWidth);
      window.removeEventListener("load", updateGridWidth);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: Actions.SET_UP_TILES_DATA });
  }, []);

  const handleBoardSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newBoardSize = parseInt(value);

    if (newBoardSize < 3) {
      return;
    }

    dispatch({
      type: Actions.SET_NUM_ROWS_COLS,
      payload: { newNumRowsCols: newBoardSize },
    });
    dispatch({
      type: Actions.SET_UP_TILES_DATA,
    });
  };

  const gridStyles: CSSProperties = {
    display: "grid",
    gridTemplateRows: `repeat(${gameState.numRowsCols}, 1fr)`,
    gridTemplateColumns: `repeat(${gameState.numRowsCols}, 1fr)`,
    width: "80vw",
    minWidth: "24rem",
    maxWidth: "50rem",
    height: `${gridWidth}px`,
    margin: "2rem auto",
    border: "2px solid red",
  };

  return (
    <div>
      <DraggableWrapper>
        <div>
          <div>
            <span>Moves:</span>
            <span>{gameState.numOfMoves}</span>
          </div>
        </div>
        <div>
          <span>Boadrd Size:</span>
          <input
            type="number"
            value={gameState.numRowsCols}
            onChange={handleBoardSizeChange}
          />
        </div>
        <div>
          {gameState.tilesData && gameState.numRowsCols && (
            <div style={gridStyles} ref={puzzleGridRef}>
              {gameState.tilesData.map((row, rowIdx) =>
                row.map((cell, cellIdx) => (
                  <Tile
                    key={`tile-${cell.value}`}
                    value={cell.value}
                    currentPosition={{ row: rowIdx, col: cellIdx }}
                    color={cell.color}
                    puzzleIsSolved={gameState.isSolved}
                    dispatch={dispatch}
                  />
                ))
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            dispatch({ type: Actions.RANDOMIZE_TILES });
            dispatch({ type: Actions.CHECK_IS_SOLEVABLE });
          }}
        >
          Reshuffle
        </button>
        <div>{gameState.isSolvable && <p>This permutation is solvable</p>}</div>
        <div>
          {!gameState.isSolvable && <p>This permutation is NOT solvable</p>}
        </div>
        <div>
          <input
            id="toggle-unsolvable"
            type="checkbox"
            checked={gameState.excludeNonSolvablePermutations}
            onChange={(event) =>
              dispatch({
                type: Actions.SET_EXCLUDE_UNSOLVABLE,
                payload: { excludeUnsolvable: event.target.checked },
              })
            }
          />
          <label htmlFor="toggle-unsolvable">
            Exclude unsolvable permutations
          </label>
        </div>
        {/* <div>
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      </div> */}
      </DraggableWrapper>
    </div>
  );
}

export default SlidePuzzle;
