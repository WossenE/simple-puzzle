export type TileDataType = {
  value: number | null;
  color: string;
};

export type GameStateType = {
  numRowsCols: number;
  numOfMoves: number;
  tilesData: TileDataType[][] | null;
  isSolved: boolean;
  isSolvable: boolean;
  excludeNonSolvablePermutations: boolean;
};

// Define action type constants
export enum Actions {
  SET_NUM_ROWS_COLS = 'SET_NUM_ROWS_COLS',
  SET_UP_TILES_DATA = 'SET_UP_TILES_DATA',
  MOVE_TILE = 'MOVE_TILE',
  RANDOMIZE_TILES = 'RANDOMIZE_TILES',
  CHECK_IS_SOLEVED = 'CHECK_IS_SOLEVED',
  CHECK_IS_SOLEVABLE = 'CHECK_IS_SOLEVABLE',
  SET_EXCLUDE_UNSOLVABLE = 'SET_EXCLUDE_UNSOLVABLE',
}

// Define an interface for each action
interface ISET_NUM_ROWS_COLS {
  type: Actions.SET_NUM_ROWS_COLS;
  payload: { newNumRowsCols: number };
}

interface ISET_UP_TILES_DATA {
  type: Actions.SET_UP_TILES_DATA;
}

interface IMOVE_TILE {
  type: Actions.MOVE_TILE;
  payload: { row: number; col: number };
}

interface IRANDOMIZE_TILES {
  type: Actions.RANDOMIZE_TILES;
}

interface ICHECK_IS_SOLEVED {
  type: Actions.CHECK_IS_SOLEVED;
}

interface ICHECK_IS_SOLEVABLE {
  type: Actions.CHECK_IS_SOLEVABLE;
}

interface ISET_EXCLUDE_UNSOLVABLE {
  type: Actions.SET_EXCLUDE_UNSOLVABLE;
  payload: { excludeUnsolvable: boolean };
}

export type ActionType =
  | ISET_NUM_ROWS_COLS
  | ISET_UP_TILES_DATA
  | IMOVE_TILE
  | IRANDOMIZE_TILES
  | ICHECK_IS_SOLEVED
  | ICHECK_IS_SOLEVABLE
  | ISET_EXCLUDE_UNSOLVABLE;
