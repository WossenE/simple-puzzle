import { ActionType } from './Actions';

type TileProps = {
  value: number | null;
  currentPosition: { row: number; col: number };
  color: string;
  dispatch: React.Dispatch<ActionType>;
};

const Tile: React.FC<TileProps> = ({
  value,
  currentPosition,
  color,
  dispatch,
}) => {
  const tileStyle = {
    width: `100%`,
    height: `100%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    backgroundColor: color,
    gridRowStart: `${currentPosition.row + 1}`,
    gridRowEnd: `${currentPosition.row + 2}`,
    gridColumnStart: `${currentPosition.col + 1}`,
    gridColumnEnd: `${currentPosition.col + 2}`,
  };

  return (
    <div
      style={tileStyle}
      onClick={() =>
        dispatch({
          type: 'MOVE_TILE',
          payload: { row: currentPosition.row, col: currentPosition.col },
        })
      }
    >
      {value}
    </div>
  );
};

export default Tile;
