import React from 'react';
import LoadingIcon from '@material-ui/icons/Cached';
import {
  FormHelperText,
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
} from '@material-ui/core';

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  errors,
  setErrors,
  setValue,
  pristine,
  isValidating,
  validate,
  formSubmitted,
  fullWidth,
  variant,
  ...other
}) => {
  const showErrors = (!pristine || formSubmitted) && !!errors.length;
  return (
    <FormControl error={showErrors} fullWidth={fullWidth} >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        variant={variant}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        endAdornment={(
          <InputAdornment position="end">
            { isValidating && <LoadingIcon />}
          </InputAdornment>
        )}
        {...other}
      />
      <FormHelperText component="div">
        {showErrors
          && errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  );
};

export default Field;
