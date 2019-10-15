import React from 'react';
import { connect } from 'react-redux';
import { Paper, useMediaQuery } from '@material-ui/core';
import { useForm, useField } from '../../shared/hooks';
import { register } from '../actions';
import shared from '../../shared';
import RegisterForm from './components/RegisterForm';
import { Logo } from '../../shared/ui';
import useStyle from './Index.style';
import RegisterConfirmationText from './components/RegisterConfirmation';
import * as authService from '../service';

function RegisterIndexPage({ onSubmit, isRegistering, registered }) {
  const classes = useStyle();
  const form = useForm(onSubmit);
  const { validations } = shared;

  const emailField = useField('email', form, {
    validations: [
      ...validations.emailValidation(),
      async (fData, eventName) => {
        if (eventName !== 'onblur' && eventName !== '') return false;
        if (fData.email.trim() === '') return false;
        const isExists = await authService.EmailExists(fData.email);
        return isExists && 'This email already exists';
      },
    ],
  });

  const passwordField = useField('password', form, {
    validations: validations.passwordValidation(),
  });
  const firstnameField = useField('firstname', form, {
    validations: validations.firstnameValidation(),
  });
  const lastnameField = useField('lastname', form, {
    validations: validations.lastnameValidation(),
  });
  const genderField = useField('gender', form, {
    validations: validations.genderValidation(),
  });
  const ageField = useField('age', form, {
    validations: validations.ageValidation(),
  }, [], -1);

  const requiredFields = [emailField, firstnameField, lastnameField, passwordField, genderField];
  const mobileLayout = useMediaQuery('(max-width:500px)');

  const getLogoProps = () => {
    if (form.getWrongFieldnames().length > 0) return { color: 'grey' };
    if (requiredFields.some(f => f.pristine)) return { color: 'grey' };
    if (registered) return { randomColor: true };
    return { color: 'red' };
  };

  const registerSectionContent = registered
    ? <RegisterConfirmationText />
    : (
      <RegisterForm
        fieldsProps={{
          emailField,
          passwordField,
          firstnameField,
          lastnameField,
          genderField,
          ageField,
        }}
        formProps={form}
        isRegistering={isRegistering}
        requiredFields={requiredFields}
      />
    );

  const registerSection = (
    <>
      <Logo
        className={classes.logo}
        width="300px"
        height="auto"
        {...getLogoProps()}
      />
      {registerSectionContent}
    </>
  );

  return (
    <div className={classes.registerPage}>
      {mobileLayout
        ? <div className={classes.registerSection}>{registerSection}</div>
        : <Paper elevation={2} className={classes.registerSection}>{registerSection}</Paper>
    }
    </div>
  );
}

const mapStateToProps = state => ({
  isRegistering: state.auth.isAuthenticating,
  registered: state.auth.justAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => { dispatch(register(formData)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterIndexPage);
