import React, { useState } from 'react';

import {
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
  FormHelperText,
} from '@material-ui/core';

import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';

export default function PasswordField(props) {
  const {
    label,
    name,
    value,
    onChange,
    errors,
    setErrors,
    setValue,
    pristine,
    isValidating,
    validate,
    formSubmitted,
    ...other
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const showErrors = (!pristine || formSubmitted) && !!errors.length;

  const handleShowPasswordClick = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <FormControl error={showErrors}>
      <InputLabel htmlFor="adornment-password">{ label || 'Password' }</InputLabel>
      <Input
        // id="adornment-password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={() => !pristine && validate()}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              onClick={handleShowPasswordClick}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
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
}
