import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import {
  Field,
  GenderSelect,
  AgeSelect,
  SubmitPanel,
} from '../../shared/ui';
import { useField, useForm } from '../../shared/hooks';
import shared from '../../shared';
import { selectors } from '../reducer';
import { updateAccountSettings } from '../actions';
// import CityField from './CityField';

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

function GeneralPanel({
  account,
  onUpdateAccountSettings,
  submitting,
}) {
  const [panelExpand, setPanelExpand] = useState(false);
  const { validations } = shared;

  const classes = useStyles();
  const form = useForm(null);
  const emailField = useField('email', form,
    { validations: validations.emailValidation() }, account.email);
  const firstnameField = useField('firstname', form,
    { validations: validations.firstnameValidation() }, account.firstname);
  const lastnameField = useField('lastname', form,
    { validations: validations.lastnameValidation() }, account.lastname);
  const genderField = useField('gender', form,
    { validations: validations.genderValidation() }, account.gender);
  const ageField = useField('age', form,
    { validations: validations.ageValidation() }, account.age);
  const requiredFields = [
    emailField, firstnameField, lastnameField,
    genderField, ageField,
  ];

  useEffect(() => {
    if (account) {
      emailField.setValue(account.email);
      firstnameField.setValue(account.firstname);
      lastnameField.setValue(account.lastname);
      genderField.setValue(account.gender);
      ageField.setValue(account.age);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.isValid) {
      const formData = form.getData();
      onUpdateAccountSettings(formData);
    }
  };

  return (
    <SubmitPanel
      title="General"
      description="Account settings"
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
        <Field label="email" {...emailField} />
        <Field label="firstname" {...firstnameField} />
        <Field label="lastname" {...lastnameField} />
        <GenderSelect {...genderField} />
        <AgeSelect {...ageField} />
        {/* <CityField /> */}
      </form>
    </SubmitPanel>
  );
}

const mapStateToProps = state => ({
  account: selectors.getAccount(state),
  submitting: selectors.isUpdatingAccount(state),
});

const mapDispatchToProps = dispatch => ({
  onUpdateAccountSettings: settings => dispatch(updateAccountSettings(settings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralPanel);
