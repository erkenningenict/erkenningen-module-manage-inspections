import React from 'react';

const CategoryRatingSlider: React.FC<{
  nestIndex: number;
  index: number;
  setValue: any;
  control: any;
  watch: any;
}> = ({ watch, nestIndex, setValue, index }) => {
  const c = watch(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const);

  const handleRatingChange = (e: any) =>
    setValue(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const, e.target.value);

  return (
    <>
      <input
        type="range"
        className="slider"
        style={{
          position: 'absolute',
          zIndex: 1,
          left: '45px',
          width: 'calc(100% - 88px)',
        }}
        value={c}
        onChange={handleRatingChange}
        min={0}
        max={10}
      ></input>
    </>
  );
};

export default CategoryRatingSlider;
