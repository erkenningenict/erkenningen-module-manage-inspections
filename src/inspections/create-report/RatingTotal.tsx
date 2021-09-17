import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { VisitatieBeoordelingCategorieVraagInput } from '../../generated/graphql';

const RatingTotal: React.FC<{
  getValues: any;
  nestIndex: number;
  index: number;
  weging: number;
  setValue: any;
  control: any;
}> = ({ getValues, nestIndex, setValue, index, weging, control }) => {
  const c = useWatch({ control, name: `ratings.${nestIndex}.Vragen.${index}.Cijfer` });
  const cijfer = c;
  const total = (weging * cijfer) / 10 || 0;

  useEffect(() => {
    setValue(`ratings.${nestIndex}.Vragen.${index}.TotaalPunten` as const, total);
    const categoryQuestions = getValues(`ratings.${nestIndex}.Vragen`);
    const categoryTotal: number = categoryQuestions.reduce(
      (total: number, qA: VisitatieBeoordelingCategorieVraagInput) => {
        return total + ((qA.TotaalPunten && parseFloat(qA.TotaalPunten?.toString())) || 0);
      },
      0,
    );
    const category = getValues(`ratings.${nestIndex}`);

    setValue(`ratings.${nestIndex}.TotaalPunten` as const, parseFloat(categoryTotal.toFixed(1)));
    const categoryRating = parseFloat(((categoryTotal / category?.Weging || 0) * 10).toFixed(2));
    setValue(`ratings.${nestIndex}.Cijfer` as const, categoryRating || 0);
  }, [c, nestIndex, index]);

  return null;
};

export default RatingTotal;
