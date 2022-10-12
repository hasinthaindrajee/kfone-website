import React from 'react';

const PrimaryButton = (props) => {
  const { startIcon, text, endIcon, onClick } = props;

  return (
    <button
      className="transition ease-in-out duration-300 rounded-lg p-4 bg-primary text-light hover:bg-secondary-600 flex items-center justify-between"
      onClick={onClick}>
      {startIcon}
      {text}
      {endIcon}
    </button>
  );
};

export default PrimaryButton;
