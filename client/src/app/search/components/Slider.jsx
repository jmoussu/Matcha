import React from 'react';
import {
  Typography,
  Slider as Sld,
  makeStyles,
} from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: 300,
  },
}));

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  name,
}) {
  const classes = useStyle();
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  // const labelId = 

  return (
    <div className={classes.root}>
      <Typography gutterBottom>
        {label}
      </Typography>
      <Sld
        value={value}
        name={name}
        min={min}
        max={max}
        onChange={(e, newValue) => onChange(name, newValue)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        // getAriaValueText={value}
      />
    </div>
  );
}

export default Slider;
