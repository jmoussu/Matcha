import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import deburr from 'lodash/deburr';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField, useForm } from '../../shared/hooks';
import TagList from './TagList';
import app from '../../app/index';
import { selectors as settingsSelectors } from '../reducer';
import { createTag, deleteTag } from '../actions';
import {
  Paper,
  Field,
} from '../../shared/ui';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(1),
    boxSizing: 'border-box',
    maxWidth: '400px',
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
  },
}));

function TagContainer({
  onFetchAllTags,
  onCreateTag,
  onDeleteTag,
  tags: appTags,
  userTags,
}) {
  useEffect(() => {
    onFetchAllTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const classes = useStyles();
  const addTagForm = useForm(null);
  const addTagField = useField('tag', addTagForm, {
    validations: [
      fData => fData.tag.length > 10
        && '10 characters max',
    ],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTag = deburr(addTagField.value.trim()).toLowerCase();
    if (userTags.some(uTag => uTag === cleanTag)) {
      addTagField.setErrors(['ce tag existe deja']);
      return;
    }
    if (addTagField.value.length > 10) {
      return;
    }
    addTagField.setValue('');
    onCreateTag(cleanTag);
  };

  const handleUserTagDelete = (userTagName) => {
    onDeleteTag(userTagName);
  };

  const handleClickSuggestionTag = (e) => {
    const { value } = e.target;
    addTagField.setValue(value);
  };

  return (
    <Paper className={classes.root}>
      <TagList
        tags={userTags}
        onDeleteTag={handleUserTagDelete}
      />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="tag-suggest">Suggested Tags</InputLabel>
        <Select
          value=""
          onChange={handleClickSuggestionTag}
          inputProps={{
            name: 'tags-sugg',
            id: 'tag-suggest',
          }}
        >
          {appTags.map(tagName => (
            <MenuItem
              key={tagName}
              value={tagName}
            >
              {tagName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <form onSubmit={handleSubmit}>
        <Field name="tag" {...addTagField} />
      </form>
    </Paper>
  );
}

const mapStateToProps = state => ({
  tags: app.selectors.getAllTags(state),
  userTags: settingsSelectors.getUserTags(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchAllTags: () => dispatch(app.actions.fetchTags()),
  onCreateTag: tag => dispatch(createTag(tag)),
  onDeleteTag: tag => dispatch(deleteTag(tag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagContainer);
