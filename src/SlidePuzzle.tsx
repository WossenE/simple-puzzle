import { CSSProperties, useEffect, useReducer, useRef, useState } from 'react';
import Tile from './Tile';
import { actions, ActionType } from './Actions';

type TileDataType = {
  value: number | null;
  color: string;
};

type GameStateType = {
  numRowsCols: number;
  numOfMoves: number;
  tilesData: TileDataType[][] | null;
};

const initialGameState = {
  numRowsCols: 4,
  imageUrl: '',
  imageWidth: 0,
  numOfMoves: 0,
  tilesData: null,
};

// Define the reducer function
const reducer = (state: GameStateType, action: ActionType): GameStateType => {
  switch (action.type) {
    case actions.SET_NUM_ROWS_COLS:
      return state; // TODO
    case actions.SET_UP_TILES_DATA:
      return { ...state, tilesData: createTilesData(state.numRowsCols) };
    case actions.MOVE_TILE:
      return {
        ...state,
        tilesData: moveTile(
          state.tilesData,
          action.payload.row,
          action.payload.col,
          state.numRowsCols,
        ),
      }; // TODO
    case actions.RANDOMIZE_TILES:
      return {
        ...state,
        tilesData: randomizeTiles(state.tilesData, state.numRowsCols),
      };
    default:
      return state;
  }
};

// Helpers
const generateSoftColor = () => {
  const red = Math.floor(Math.random() * 156 + 80);
  const green = Math.floor(Math.random() * 156 + 80);
  const blue = Math.floor(Math.random() * 156 + 80);

  const hexColor = `#${red.toString(16)}${green.toString(16)}${blue.toString(
    16,
  )}`;

  return hexColor;
};

const createTilesData = (numRowsCols: number) => {
  const tilesData = new Array(numRowsCols)
    .fill(null)
    .map((_) => new Array(numRowsCols).fill(null));

  for (let row = 0; row < numRowsCols; row += 1) {
    for (let col = 0; col < numRowsCols; col += 1) {
      tilesData[row][col] = {
        value: row * numRowsCols + col,
        color: generateSoftColor(),
      };
    }
  }


  // The last tile should be empty
  tilesData[numRowsCols - 1][numRowsCols - 1].value = null;
  tilesData[numRowsCols - 1][numRowsCols - 1].color = '#fff';

  return tilesData;
};

const copyTilesData = (tilesData: TileDataType[][]) => {
  const newTilesData = tilesData.map((row) => {
    return row.map((tile) => ({ ...tile }));
  });
  return newTilesData;
};

const randomizeTiles = (
  tilesData: TileDataType[][] | null,
  numRowsCols: number,
) => {
  if (!tilesData) {
    return null;
  }

  const randArr = new Array(numRowsCols * numRowsCols - 1)
    .fill(null)
    .map((_, idx) => idx + 1);
  for (let i = 0; i < randArr.length; i += 1) {
    const randIdx = Math.floor(Math.random() * randArr.length);
    // swap
    const temp = randArr[randIdx];
    randArr[randIdx] = randArr[i];
    randArr[i] = temp;
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

const getValidNeighbors = (
  { row, col }: { row: number; col: number },
  numRowsCols: number,
) => {
  const neighbors = [
    [row, col - 1],
    [row, col + 1],
    [row - 1, col],
    [row + 1, col],
  ];

  const validNeighbors = neighbors
    .filter(([rowIdx, colIdx]) => {
      return (
        0 <= rowIdx &&
        rowIdx < numRowsCols &&
        0 <= colIdx &&
        colIdx < numRowsCols
      );
    })

  return validNeighbors;
};

const moveTile = (
  tilesData: TileDataType[][] | null,
  row: number,
  col: number,
  numRowsCols: number,
) => {
  if (!tilesData) {
    return null;
  }

  const neighbors = getValidNeighbors( { row, col }, numRowsCols);
  const emptyTileIndices = neighbors.filter(([row, col]) => tilesData[row][col].value === null)[0];
  console.log(`emptyTileIndices ${JSON.stringify(emptyTileIndices)}`)

  if (emptyTileIndices === undefined) {
    console.log('Does NOT have empty neighbor');
    return tilesData;
  }

  const [emptyTileRow, emptyTileCol] = emptyTileIndices;

  console.log(`You clicked on [${row}, ${col}]`);
  console.log(`Has empty neighbor at [${emptyTileRow}, ${emptyTileCol}]`);

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

    window.addEventListener('resize', updateGridWidth);

    if (puzzleGridRef.current) {
      setGridWidth(puzzleGridRef.current.clientWidth);
    }
    return () => {
      window.removeEventListener('resize', updateGridWidth);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_UP_TILES_DATA' });
  }, []);

  const gridStyles: CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${gameState.numRowsCols}, 1fr)`,
    gridTemplateColumns: `repeat(${gameState.numRowsCols}, 1fr)`,
    width: '80vw',
    minWidth: '24rem',
    maxWidth: '50rem',
    height: `${gridWidth}px`,
    margin: '2rem auto',
    border: '2px solid red',
  };

  return (
    <div>
      <div>
        {gameState.tilesData && gameState.numRowsCols && (
          <div style={gridStyles} ref={puzzleGridRef}>
            {gameState.tilesData.map((row, rowIdx) =>
              row.map((cell, cellIdx) => (
                <Tile
                  key={`tile-${cell.value}`}
                  value={cell.value}
                  currentPosition={{row: rowIdx, col: cellIdx}}
                  color={cell.color}
                  dispatch={dispatch}
                />
              )),
            )}
          </div>
        )}
      </div>
      <button onClick={() => dispatch({ type: 'RANDOMIZE_TILES' })}>
        Randomize
      </button>
      <div>
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      </div>
    </div>
  );
}

export default SlidePuzzle;
