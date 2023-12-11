import React, { useState, useEffect } from 'react';

interface RowsColsInputProps {
  setRowsCols: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const RowsColsInput: React.FC<RowsColsInputProps> = ({ setRowsCols }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // minor validation
    if (/^[1-9]\d*$/.test(value)) {
      setInputValue(value);
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    const value = parseInt(inputValue, 10);
    setRowsCols(isNaN(value) ? 0 : value);
  }, [inputValue, setRowsCols]);

  return (
    <div>
      <label htmlFor="rowsColsInput">Please, input the number of rows and columns: </label>
      <input
        type="text"
        pattern="[0-9]*"
        id="rowsColsInput"
        value={inputValue}
        onChange={handleInputChange}
        required
      />
    </div>
  );
};

export default RowsColsInput;
