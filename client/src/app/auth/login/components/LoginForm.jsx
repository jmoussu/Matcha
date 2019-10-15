import React from 'react';
import { Field, PasswordField, SubmitButton } from '../../../shared/ui';
import useStyle from './LoginForm.style';

export default function LoginForm(props) {
  const classes = useStyle();
  const {
    fieldsProps: {
      emailField,
      passwordField,
    },
    formProps: {
      onSubmit,
      isValid,
    },
    isLogging,
    requiredFields,
  } = props;
  return (
    <form className={classes.form} onSubmit={(e) => { onSubmit(e); }}>
      <Field className={classes.field} label="Email" type="email" {...emailField} />
      <PasswordField className={classes.field} label="Password" {...passwordField} />
      <SubmitButton
        variant="outlined"
        type="submit"
        disabled={
          !isValid()
          || isLogging
          || requiredFields.some(f => f.pristine)
        }
        loading={isLogging}
      >
        Login
      </SubmitButton>
    </form>
  );
}
