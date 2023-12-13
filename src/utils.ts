import { TileDataType } from './types';

export const generateSoftColor = () => {
  const red = Math.floor(Math.random() * 156 + 80);
  const green = Math.floor(Math.random() * 156 + 80);
  const blue = Math.floor(Math.random() * 156 + 80);

  const hexColor = `#${red.toString(16)}${green.toString(16)}${blue.toString(
    16,
  )}`;

  return hexColor;
};

export const getRandArr = (length: number) => {
  const randArr = new Array(length * length - 1)
    .fill(null)
    .map((_, idx) => idx + 1); // + 1 to exclude zero

  for (let i = 0; i < randArr.length; i += 1) {
    const randIdx = Math.floor(Math.random() * randArr.length);
    // swap
    const temp = randArr[randIdx];
    randArr[randIdx] = randArr[i];
    randArr[i] = temp;
  }

  return randArr;
};

export const countInversions = (arr: number[]) => {
  let numInversions = 0;

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[j] < arr[i]) {
        numInversions += 1;
      }
    }
  }

  return numInversions;
};

// Deep copy tiles' data
export const copyTilesData = (tilesData: TileDataType[][]) => {
  const newTilesData = tilesData.map((row) => {
    return row.map((tile) => ({ ...tile }));
  });
  return newTilesData;
};

// Method to get all neighbors within the grid boundaries
export const getValidNeighbors = (
  { row, col }: { row: number; col: number },
  numRowsCols: number,
) => {
  const neighbors = [
    [row, col - 1],
    [row, col + 1],
    [row - 1, col],
    [row + 1, col],
  ];

  const validNeighbors = neighbors.filter(([rowIdx, colIdx]) => {
    return (
      0 <= rowIdx && rowIdx < numRowsCols && 0 <= colIdx && colIdx < numRowsCols
    );
  });

  return validNeighbors;
};

const isOdd = (n: number) => n % 2 === 1;
const isEven = (n: number) => !isOdd(n);

export const isSolvable = (arr: number[] | null, numRowsCols: number) => {
  if (!arr) {
    return false;
  }
  /*
   *  https://www.cs.princeton.edu/courses/archive/spring21/cos226/assignments/8puzzle/specification.php#:~:text=In%20summary%2C%20when%20n%20is,number%20of%20inversions%20is%20even.
   *
   *  When n is odd, an n-by-n board is solvable if and only if its number of inversions is even.
   *  When n is even, an n-by-n board is solvable if and only if the number of inversions plus the row of the blank square (indexed starting at 0) is odd.
   */

  const numInversions = countInversions(arr);


  if (isOdd(numRowsCols)) {
  // odd sized board
    return isEven(numInversions);
  } else {
  // odd sized board
    return isOdd(numInversions + numRowsCols - 1);
  }
};

export const isArrSorted = (arr: number[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
};

export const checkIsSolved = (tilesData: TileDataType[][] | null) => {
  if (!tilesData) {
    return false;
  }
  const numOfNonEmptyTiles = tilesData.length * tilesData.length - 1;
  const flattend = tilesData
    .flat()
    .map((tile) => tile.value)
    .slice(0, numOfNonEmptyTiles);
  if (flattend.includes(null)) {
    return false;
  }

  const isSolved = isArrSorted(flattend as number[]);
  return isSolved;
};
