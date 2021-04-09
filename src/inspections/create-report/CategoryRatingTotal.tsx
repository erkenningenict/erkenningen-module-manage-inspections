import React from 'react';
import { useWatch } from 'react-hook-form';

const CategoryRatingTotal: React.FC<{
  index: number;
  control: any;
}> = ({ index, control }) => {
  const c = useWatch({ control, name: `ratings.${index}` });
  const total = c.TotaalPunten || 0;
  return <div>{total}</div>;
};

export default CategoryRatingTotal;
