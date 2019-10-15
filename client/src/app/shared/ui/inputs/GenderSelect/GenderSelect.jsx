import React from 'react';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  Input,
} from '@material-ui/core';

export default function GenderSelect(props) {
  const { onChange, value, errors, pristine } = props;
  const showErrors = (!pristine && !!errors.length);
  return (
    <FormControl error={showErrors}>
      <InputLabel htmlFor="gender-helper">Gender</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        input={<Input name="gender" id="gender-helper" />}
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </Select>
      <FormHelperText component="div">
        {showErrors
          && errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  );
}
