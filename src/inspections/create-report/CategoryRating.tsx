import React from 'react';
import { useWatch } from 'react-hook-form';

const CategoryRating: React.FC<{
  index: number;
  control: any;
}> = ({ index, control }) => {
  const c = useWatch({ control, name: `ratings.${index}` });

  return <span>{c?.Cijfer}</span>;
};

export default CategoryRating;
