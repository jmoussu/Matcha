import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Switch,
} from '@material-ui/core';
import {
  SubmitPanel,
} from '../../shared/ui';
import { updateSearchPreferences } from '../actions';
import { selectors } from '../reducer';

function SearchPanel({ searchPref, onUpdateSearchPreferences, submitting }) {
  const [panelExpand, setPanelExpand] = useState(false);
  const [switches, setSwitches] = useState(false);

  const handleChange = (e) => {
    setSwitches({ ...switches, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSearchPreferences(switches);
  };

  useEffect(() => {
    setSwitches({
      male: searchPref.male,
      female: searchPref.female,
      other: searchPref.other,
    });
  }, [searchPref]);

  return (
    <SubmitPanel
      title="Search"
      description="Who do you want to search ?"
      onChange={() => setPanelExpand(prev => !prev)}
      submitting={submitting}
      onCancel={() => setPanelExpand(false)}
      onSubmit={(e) => { handleSubmit(e); }}
      expanded={panelExpand}
      canSubmit
    >
      <form onSubmit={e => handleSubmit(e)}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Genders</FormLabel>
          <FormGroup aria-label="position" name="position">
            <FormControlLabel
              name="male"
              value="male"
              control={<Switch color="primary" />}
              label="Male"
              labelPlacement="start"
              onChange={(e) => { handleChange(e); }}
              checked={switches.male}
            />
            <FormControlLabel
              name="female"
              value="female"
              control={<Switch color="primary" />}
              label="Female"
              labelPlacement="start"
              onChange={(e) => { handleChange(e); }}
              checked={switches.female}
            />
            <FormControlLabel
              name="other"
              value="other"
              control={<Switch color="primary" />}
              label="Other"
              labelPlacement="start"
              onChange={(e) => { handleChange(e); }}
              checked={switches.other}
            />
          </FormGroup>
        </FormControl>
      </form>
    </SubmitPanel>
  );
}

const mapDispatchToProps = dispatch => ({
  onUpdateSearchPreferences: searchPref => dispatch(updateSearchPreferences(searchPref)),
});

const mapStateToProps = state => ({
  searchPref: selectors.getSearch(state),
  submitting: selectors.isUpdatingSearchPref(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
