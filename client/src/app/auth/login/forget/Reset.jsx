import React, { useState } from 'react';
import {
  Typography,
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { LockOpen as LockOpenIcon } from '@material-ui/icons';
import { PasswordField, SubmitButton, Paper } from '../../../shared/ui';
import { useField, useForm } from '../../../shared/hooks';
import shared from '../../../shared';
import * as authService from '../../service';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // width: '100vw',
    alignContent: 'center',
    justifyContent: 'center',
  },
  resetSection: {
    marginTop: theme.spacing(4),
    maxWidth: '400px',
    padding: theme.spacing(2, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    margin: theme.spacing(1),
  },
  lockIcon: {
    width: '30%',
    height: 'auto',
  },
}));

export default function PasswordResetPage(props) {
  const [passwordReset, setPasswordReset] = useState(false);
  const submit = async (formData, isFormValid) => {
    if (isFormValid) {
      const {
        match: {
          params: {
            token,
            email,
          },
        },
      } = props;
      const isSuccess = await authService.UpdatePasswordAfterReset(
        email, formData.password, token,
      );
      setPasswordReset(isSuccess);
    }
  };

  const form = useForm(submit);
  const { isValid, isSubmitting, onSubmit, isSubmitted } = form;
  const passwordField = useField('password', form, {
    validations: shared.validations.passwordValidation(),
  });
  const classes = useStyles();
  const requiredFields = [passwordField];

  return (
    <div className={classes.root}>
      {/* password has been updated */}
      { passwordReset && (
        <Dialog
          open
          onClose={null}
        >
          <DialogTitle id="alert-dialog-title">Password Updating</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your password has been updated. You can now login with it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to="/login">
              <Button color="primary" autoFocus>
                Go to login
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      )}
      {/* somthing is going wrong */}
      { isSubmitted && passwordReset === false && (
        <Dialog
          open
          onClose={null}
        >
          <DialogTitle id="alert-dialog-title">Link has expired</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              It seems your update password link has expired.
              When you receive this link, you have 10 minutes to
              update your password. 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to="/password/forget">
              <Button color="primary" autoFocus>
                Ask new link
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      )}
      <Paper className={classes.resetSection}>
        <LockOpenIcon className={classes.lockIcon} />
        <Typography variant="h6" align="center">
        Reset your password
        </Typography>
        <Typography variant="subtitle1" align="center">
          {'Enter a new password to getback to your account.'}
        </Typography>
        <form className={classes.form} onSubmit={(e) => { onSubmit(e); }}>
          <PasswordField label="Password" {...passwordField} />
          <SubmitButton
            variant="text"
            type="submit"
            disabled={
              !isValid()
              || isSubmitting
              || requiredFields.some(f => f.pristine)
            }
            loading={isSubmitting}
          >
            Update my password
          </SubmitButton>
        </form>
      </Paper>
    </div>
  );
}
