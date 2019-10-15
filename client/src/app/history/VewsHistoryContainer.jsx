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
  visits,
  onFetchVisits,
}) {
  const classes = useStyles();

  const handleClickCard = (id) => {
    history.push(`/users/${id}`);
  };

  useEffect(() => {
    onFetchVisits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = visits.map((visit) => {
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
  visits: histSelectors.getVisits(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchVisits: () => dispatch(actions.getAllVisits()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
