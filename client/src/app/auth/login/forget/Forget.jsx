import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import LockIcon from '@material-ui/icons/LockOutlined';
import { Field, SubmitButton, Paper } from '../../../shared/ui';
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
  forgetSection: {
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

export default function PasswordForgetPage() {
  const [emailSent, setEmailSent] = useState(false);

  async function submitEmail(formData, formValid) {
    if (formValid) {
      const { email } = formData;
      try {
        await authService.sendResetPasswordEmail(email);
        setEmailSent(true);
      } catch (err) {
        // console.log('err: ');
      }
    }
  }

  const form = useForm(submitEmail);
  const { isValid, onSubmit, isSubmitting } = form;
  const emailField = useField('email', form, {
    validations: [...shared.validations.emailValidation(),
      async (fData, eventName) => {
        if (eventName !== 'onblur' && eventName !== '') return false;
        if (fData.email.trim() === '') return false;
        const isExists = await authService.EmailExists(fData.email);
        return !isExists && 'This email is not linked to an account';
      },
    ],
  });
  const classes = useStyles();
  const requiredFields = [emailField];

  return (
    <div className={classes.root}>
      { emailSent && (
        <Dialog
          open
          onClose={null}
        >
          <DialogTitle id="alert-dialog-title">Email Sent</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              An email is sending, please check your inbox and click on the
              reset link to update your password.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to="/">
              <Button color="primary" autoFocus>
                Back home
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      )}
      <Paper className={classes.forgetSection}>
        <LockIcon className={classes.lockIcon} />
        <Typography variant="h6" align="center">
        Trouble Logging In?
        </Typography>
        <Typography variant="subtitle1" align="center">
          {"Enter your email and we'll send you a\
        link to getback into your account."}
        </Typography>
        <form className={classes.form} onSubmit={(e) => { onSubmit(e); }}>
          <Field
            className={classes.field}
            {...emailField}
            variant="text"
            type="text"
            label="Email"
          />
          <SubmitButton
            variant="text"
            type="submit"
            loading={isSubmitting}
            disabled={
              !isValid()
              // || isRegistering
              || requiredFields.some(f => f.pristine)
            }
            // loading={isRegistering}
          >
            Send me link
          </SubmitButton>
        </form>
      </Paper>
    </div>
  );
}
