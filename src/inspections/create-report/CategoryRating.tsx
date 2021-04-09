import React from 'react';
import { useWatch } from 'react-hook-form';

const CategoryRating: React.FC<{
  index: number;
  control: any;
}> = ({ index, control }) => {
  const c = useWatch({ control, name: `ratings.${index}` });
  return <div>{c?.Cijfer}</div>;
};

export default CategoryRating;
