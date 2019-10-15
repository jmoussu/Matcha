import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { ProfileCard } from '../shared/ui';
import { selectors as histSelectors } from './reducer';
import * as actions from './action';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function HistoryContainer({
  history,
  likes,
  onFetchLikes,
}) {
  const classes = useStyles();

  const handleClickCard = (id) => {
    history.push(`/users/${id}`);
  };

  useEffect(() => {
    onFetchLikes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = likes.map((visit) => {
    return (
      <ProfileCard
        key={visit.id}
        id={visit.id}
        age={visit.age}
        firstName={visit.firstname}
        bio={visit.bio}
        online={visit.online}
        tags={visit.tags}
        image={visit.path}
        onClick={() => handleClickCard(visit.id)}
      />
    );
  });
  return (
    <div className={classes.root}>
      {list}
    </div>
  );
}

const mapStateToProps = state => ({
  likes: histSelectors.getLikes(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchLikes: () => dispatch(actions.getAllLikes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
