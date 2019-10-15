import React from 'react';
import useStyle from './RegisterForm.style';

import {
  Field,
  PasswordField,
  SubmitButton,
  GenderSelect,
  AgeSelect,
} from '../../../shared/ui';

export default function RegisterForm(props) {
  const {
    fieldsProps: {
      emailField,
      passwordField,
      firstnameField,
      lastnameField,
      genderField,
      ageField,
    },
    formProps: {
      onSubmit,
      isValid,
    },
    isRegistering,
    requiredFields,
  } = props;
  const classes = useStyle();
  return (
    <form className={classes.form} onSubmit={(e) => { onSubmit(e); }}>
      <Field className={classes.field} label="Email" type="email" {...emailField} />
      <Field className={classes.field} label="Firstname" type="text" {...firstnameField} />
      <Field className={classes.field} label="Lastname" type="text" {...lastnameField} />
      <GenderSelect {...genderField} />
      <AgeSelect {...ageField} />
      <PasswordField className={classes.field} label="Password" {...passwordField} />
      <SubmitButton
        variant="text"
        type="submit"
        disabled={
          !isValid()
          || isRegistering
          || requiredFields.some(f => f.pristine)
        }
        loading={isRegistering}
      >
        Register
      </SubmitButton>
    </form>
  );
}
