import {
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Input,
  Button,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from './components/Slider';
import app from '../app/index';
import SortResultSelect from './components/SortResultButton';
import { sortProfiles, fetchCustomSearch, resetProfiles } from './actions';
import { selectors } from './reducer';
import { ProfileCard, SubmitButton } from '../shared/ui';
import settings from '../settings';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function SearchContainer({
  appTags,
  onFetchAllTags,
  onSortProfiles,
  profiles,
  onFetchSearchResult,
  searchPref,
  gender,
  history,
  onResetProfiles,
  hasImages,
}) {
  const classes = useStyles();
  const [tagList, setTagList] = useState([]);
  const [sliders, setSliders] = useState({
    age: [16, 80],
    location: [5],
    score: [0, 100],
  });
  const [sortValue, setSortValue] = useState('location');

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchGender = Object.keys(searchPref).filter(val => searchPref[val]);
    const pref = {
      sex: gender,
      searchPref: searchGender,
      popularity: sliders.score,
      age: sliders.age,
      tags: tagList,
      location: sliders.location[0],
    };
    onFetchSearchResult(pref);
  };

  const handleSliders = (name, newValue) => {
    setSliders(state => ({
      ...state,
      [name]: newValue,
    }));
  };

  const handleTags = (e) => {
    setTagList(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
  };

  useEffect(() => {
    onFetchAllTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onSortProfiles(sortValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortValue]);

  useEffect(() => {
    if (gender !== null && searchPref !== null) {
      const searchGender = Object.keys(searchPref).filter(val => searchPref[val]);
      const pref = {
        sex: gender,
        searchPref: searchGender,
        popularity: [0, 100],
        age: [16, 80],
        tags: [],
        location: 20,
      };
      onFetchSearchResult(pref);
    }
    return () => onResetProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, searchPref]);

  const handleClickCard = (id) => {
    history.push(`users/${id}`);
  };

  const profileList = profiles.map(profile => (
    <ProfileCard
      key={profile.id}
      id={profile.id}
      age={profile.age}
      firstName={profile.firstname}
      bio={profile.bio}
      online={profile.online}
      tags={profile.tags}
      image={profile.path}
      onClick={() => handleClickCard(profile.id)}
    />
  ));

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={classes.form}>

        <Slider
          name="age"
          min={16}
          max={80}
          label="Age"
          onChange={handleSliders}
          value={sliders.age}
        />
        <Slider
          name="location"
          min={5}
          max={20}
          label="Max Location (km)"
          onChange={handleSliders}
          value={sliders.location}
        />
        <Slider
          name="score"
          min={0}
          max={100}
          label="Popularity"
          onChange={handleSliders}
          value={sliders.score}
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple">Tags</InputLabel>
          <Select
            multiple
            value={tagList}
            onChange={handleTags}
            input={<Input id="select-multiple" />}
            MenuProps={MenuProps}
          >
            {appTags.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <SubmitButton>
          Search
        </SubmitButton>
      </form>
      <SortResultSelect
        value={sortValue}
        onChange={handleSortChange}
      />
      {hasImages && profileList}
      {/* { profiles.length === 0 && (
        <Typography variant="h6">
          Nobody likes you .... zebi
        </Typography>
      )} */}
      { hasImages === false && (
        <>
          <Typography variant="h6">
            {"Ton profil n'est pas etendu. Va l'etendre sur la corde a linge."}
          </Typography>
          <Typography variant="subtitle1">
            {"Ca veut dire que tu n'as pas d'images"}
          </Typography>
          <Link to="/account">
            <Button variant="contained" color="primary">
              Go to settings
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  appTags: app.selectors.getAllTags(state),
  profiles: selectors.getProfiles(state),
  searchPref: settings.selectors.getSearch(state),
  gender: settings.selectors.getGender(state),
  hasImages: settings.selectors.hasImages(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchAllTags: () => dispatch(app.actions.fetchTags()),
  onSortProfiles: type => dispatch(sortProfiles(type)),
  onFetchSearchResult: search => dispatch(fetchCustomSearch(search)),
  onResetProfiles: () => dispatch(resetProfiles()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
