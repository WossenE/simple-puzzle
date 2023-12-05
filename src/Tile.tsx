// Tile.tsx
import React from "react";

interface TileProps {
  value: number;
  position: { left: number; top: number } | undefined; // Make sure it's defined
  image: string;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ value, position, image, onClick }) => {
  if (!position || value === 0) {
    return null;
  }

  const style = {
    left: `${position.left}px`,
    top: `${position.top}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: "400% 400%",
    backgroundPosition: `-${(position.left / 400) * 100}% -${
      (position.top / 400) * 100
    }%`,
  };
  console.log({ value });

  return (
    <div className="tile" style={style} onClick={onClick}>
      <div className="title-box">
        <div className="tile-number">{value}</div>
      </div>
    </div>
  );
};

export default Tile;
