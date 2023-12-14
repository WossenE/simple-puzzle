import { CSSProperties } from 'react';
import { ActionType, Actions } from './types';

type TileProps = {
  value: number | null;
  currentPosition: { row: number; col: number };
  color: string;
  puzzleIsSolved: boolean;
  dispatch: React.Dispatch<ActionType>;
};

const Tile: React.FC<TileProps> = ({
  value,
  currentPosition,
  color,
  puzzleIsSolved,
  dispatch,
}) => {
  const tileStyle: CSSProperties = {
    width: `100%`,
    height: `100%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    backgroundColor: puzzleIsSolved ? '#E0E0E0' : color,
    border: '1px solid #eed',
    gridRowStart: `${currentPosition.row + 1}`,
    gridRowEnd: `${currentPosition.row + 2}`,
    gridColumnStart: `${currentPosition.col + 1}`,
    gridColumnEnd: `${currentPosition.col + 2}`,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 2s ease-in'
  };

  const handleClick = () => {
    if (!puzzleIsSolved) {
      dispatch({
        type: Actions.MOVE_TILE,
        payload: { row: currentPosition.row, col: currentPosition.col },
      });
      dispatch({
        type: Actions.CHECK_IS_SOLEVED,
      });
    }
  };

  return (
    <div style={tileStyle} onClick={handleClick}>
      {value}
    </div>
  );
};

export default Tile;
