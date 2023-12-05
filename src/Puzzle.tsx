// Puzzle.tsx
import React, { useState, useEffect } from "react";
import ImageSelector from "./ImageSelector";
import Tile from "./Tile";

interface PuzzleProps {}

const Puzzle: React.FC<PuzzleProps> = () => {
  const [image, setImage] = useState<string | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(15);
  const [tilePositions, setTilePositions] = useState<
    { left: number; top: number }[]
  >([]);

  useEffect(() => {
    const initialTiles = Array.from({ length: 16 }, (_, index) => index + 1);
    initialTiles[15] = 0;
    setTiles(shuffleTiles(initialTiles));
  }, []);

  const shuffleTiles = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  //THERE IS ERROR WITH POSITION FIX LATER
  const calculateTilePositions = (imageWidth: number, imageHeight: number) => {
    console.log("Image Width:", imageWidth);
    console.log("Image Height:", imageHeight);

    const positions: { left: number; top: number }[] = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const left = (col * imageWidth) / 4;
        const top = (row * imageHeight) / 4;
        positions.push({ left, top });
      }
    }

    setTilePositions(positions);
  };


  const handleImageSelect = (selectedImage: string) => {
    setImage(selectedImage);

    const tempImage = new Image();
    tempImage.src = selectedImage;

    tempImage.onload = () => {
      calculateTilePositions(tempImage.width, tempImage.height);
    };
  };

  // FIX LATER

  const handleTileClick = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    if (canMove(row, col)) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 0;
      setTiles(newTiles);
      setEmptyIndex(index);
    }
  };

  const canMove = (row: number, col: number) => {
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  // const isSolved = () => {
  //   for (let i = 0; i < tiles.length - 1; i++) {
  //     if (tiles[i] !== i + 1) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  return (
    <div>
      {!image ? (
        <ImageSelector onImageSelect={handleImageSelect} />
      ) : (
        <div className="puzzle-container">
          {tiles.map((tile, index) => (
            <Tile
              key={index}
              value={tile}
              position={tilePositions[index]}
              image={image}
              onClick={() => handleTileClick(index)}
            />
          ))}
          {/* {isSolved() && <p>Congratulations! Puzzle solved!</p>} */}
        </div>
      )}
    </div>
  );
};

export default Puzzle;
