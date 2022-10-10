import React from 'react';

const RoundedIconButton = (props) => {
  const { icon } = props;
  return (
    <button className="border bg-white border-primary text-primary hover:border-secondary hover:bg-secondary hover:text-white rounded-full drop-shadow p-3">
      {icon && icon}
    </button>
  );
};

export default RoundedIconButton;
