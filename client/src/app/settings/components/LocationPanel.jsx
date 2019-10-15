import { connect } from 'react-redux';
import React, { useState } from 'react';
import {
  makeStyles,
  TextField,
} from '@material-ui/core';
import Downshift from 'downshift';
// import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { selectors } from '../reducer';
import { fetchCitySuggestions, saveCity } from '../actions';
import {
  SubmitPanel,
} from '../../shared/ui';

function renderInput(inputProps) {
  const {
    InputProps,
    classes,
    ref,
    ...other
} = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.nom) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.nom + suggestion.code}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.codesPostaux.length > 1 ? suggestion.nom
        : `${suggestion.nom} (${suggestion.codesPostaux[0]})`
      }
    </MenuItem>
  );
}

function getSuggestions(value, suggestions, { showEmpty = false } = {}) {
  // console.log(suggestions);
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter((suggestion) => {
      const keep = count < 5 && suggestion.nom.slice(0, inputLength).toLowerCase() === inputValue;
      if (keep) {
        count += 1;
      }
      return keep;
    });
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function IntegrationDownshift({
  onFetchSuggestions,
  suggestions,
  onSaveCity,
}) {
  const classes = useStyles();
  const [panelExpand, setPanelExpand] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      // console.log(value);
      onSaveCity(value);
    }
  };

  return (
    <SubmitPanel
      title="Location"
      description="Change your location"
      onChange={() => setPanelExpand(prev => !prev)}
      // submitting={submitting}
      onCancel={() => setPanelExpand(false)}
      onSubmit={(e) => { handleSubmit(e); }}
      expanded={panelExpand}
      canSubmit={suggestions.length > 0}
    >
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => {
          const { onBlur, onFocus, onChange, ...inputProps } = getInputProps({
            placeholder: 'City',
            onChange: (e) => {
              setValue(e.target.value);
              onFetchSuggestions(e.target.value);
            },
            onBlur: (e) => {
              setValue(e.target.value);
            },
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                label: 'Country',
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onFocus, onChange },
                inputProps,
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue, suggestions).map((suggestion, index) => renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.nom }),
                      highlightedIndex,
                      selectedItem,
                    }))}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    </SubmitPanel>
  );
}

const mapStateToProps = state => ({
  suggestions: selectors.getCities(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchSuggestions: text => dispatch(fetchCitySuggestions(text)),
  onSaveCity: text => dispatch(saveCity(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationDownshift);
