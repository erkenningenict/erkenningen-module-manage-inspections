import React from 'react';

const CategoryRatingSlider: React.FC<{
  nestIndex: number;
  index: number;
  setValue: any;
  control: any;
  watch: any;
  trigger: any;
  isReadOnly: boolean;
}> = ({ watch, nestIndex, setValue, index, isReadOnly, trigger }) => {
  const c = watch(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const);

  const handleRatingChange = async (e: any) => {
    setValue(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const, +e.target.value);
    await trigger(`ratings.${nestIndex}.Vragen.${index}.Cijfer`);
  };

  return (
    <>
      <input
        type="range"
        className="form-control slider"
        style={{ background: '#d3ebea', height: '36px' }}
        value={c}
        onChange={handleRatingChange}
        disabled={isReadOnly}
        min={0}
        max={10}
      ></input>
    </>
  );
};

export default CategoryRatingSlider;
