import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Logo, Paper } from '../../shared/ui';
import { useForm, useField } from '../../shared/hooks';
import { login } from '../actions';
import LoginForm from './components/LoginForm';
import useStyle from './Login.style';
import shared from '../../shared';

function LoginPage({
  isLogging, isLogged, onSubmit, history,
}) {
  const classes = useStyle();
  const form = useForm(onSubmit);
  const emailField = useField('email', form, {
    validations: shared.validations.emailValidation(),
  });
  const passwordField = useField('password', form, {
    validations: shared.validations.passwordValidation(),
  });
  const requiredFields = [emailField, passwordField];

  useEffect(() => {
    if (isLogged) {
      history.replace('/');
    }
  }, [isLogged, history]);

  return (
    <div className={classes.registerPage}>
      <Paper className={classes.registerSection}>
        <Logo
          width="300px"
          height="auto"
          color="grey"
        />
        <LoginForm
          fieldsProps={{
            emailField,
            passwordField,
          }}
          formProps={form}
          isLogging={isLogging}
          requiredFields={requiredFields}
        />
        <Link to="/login/forget">
          <Button size="small">
            Forgot password
          </Button>
        </Link>
      </Paper>
    </div>
  );
}

const mapStateToProps = state => ({
  isLogging: state.auth.isAuthenticating,
  isLogged: state.auth.isAuth,
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => { dispatch(login(formData)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage));
