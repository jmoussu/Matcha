import React from 'react';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  Input,
} from '@material-ui/core';

export default function AgeSelect(props) {
  const { onChange, value, errors, pristine } = props;
  const showErrors = (!pristine && !!errors.length);
  return (
    <FormControl error={showErrors}>
      <InputLabel htmlFor="age-helper">Age</InputLabel>
      <Select

        value={value}
        onChange={onChange}
        input={<Input name="age" id="age-helper" />}
      >
        { [...Array(80 - 17).keys()].map((num) => {
          const age = num + 16;
          return (
            <MenuItem value={age} key={age}>
              {age}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText component="div">
        {showErrors
          && errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  );
}
