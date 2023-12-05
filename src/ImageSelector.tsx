// ImageSelector.tsx
import React from 'react';

interface ImageSelectorProps {
  onImageSelect: (image: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageBase64 = reader.result as string;
        onImageSelect(imageBase64);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label htmlFor="imageInput">Please, choose an image: </label>
      <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default ImageSelector;
