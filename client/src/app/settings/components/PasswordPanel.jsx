import { connect } from 'react-redux';
import React, { useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import {
  PasswordField,
  SubmitPanel,
} from '../../shared/ui';
import { useField, useForm } from '../../shared/hooks';
import shared from '../../shared';
import { updatePassword } from '../actions';
import { selectors } from '../reducer';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  form: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  spinner: {
    flexGrow: 1,
  },
}));
// faut envoyer le form avec l ancien pass et le nouveau
function PasswordPanel({ onUpdatePassword, submitting }) {
  const [panelExpand, setPanelExpand] = useState(false);
  const { validations } = shared;

  const classes = useStyles();
  const form = useForm(null);
  const oldPassword = useField('oldpassword', form);
  const newPassword = useField('password', form,
    { validations: validations.passwordValidation() });
  const requiredFields = [oldPassword, newPassword];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePassword({
      oldPassword: oldPassword.value,
      password: newPassword.value,
    });
  };

  return (
    <SubmitPanel
      title="Password"
      description="Change password"
      onChange={() => setPanelExpand(prev => !prev)}
      submitting={submitting}
      onCancel={() => setPanelExpand(false)}
      onSubmit={(e) => { handleSubmit(e); }}
      expanded={panelExpand}
      canSubmit={
        form.isValid()
        && !requiredFields.some(f => f.pristine)
      }
    >
      <form className={classes.form} onSubmit={(e) => { handleSubmit(e); }}>
        <PasswordField label="Old password" {...oldPassword} />
        <PasswordField label="New Password" {...newPassword} />
      </form>
    </SubmitPanel>
  );
}

const mapDispatchToProps = dispatch => ({
  onUpdatePassword: pass => dispatch(updatePassword(pass)),
});

const mapStateToProps = state => ({
  submitting: selectors.isUpdatingPassword(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPanel);
