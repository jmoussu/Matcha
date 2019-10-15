import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  Typography,
  makeStyles,
  Divider,
  Button,
  LinearProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  spinner: {
    flexGrow: 1,
  },
}));

export default function SubmitPanel(props) {
  const classes = useStyles();
  const {
    title,
    description,
    children,
    onChange,
    expanded,
    submitting,
    onCancel,
    onSubmit,
    canSubmit,
  } = props;
  return (
    <ExpansionPanel
      className={classes.root}
      expanded={expanded}
      TransitionProps={{ unmountOnExit: true }}
      onChange={onChange}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div className={classes.column}>
          <Typography className={classes.heading}>
            {title}
          </Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            {description}
          </Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {children}
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        { submitting && (<LinearProgress className={classes.spinner} />)}
        <Button
          size="small"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
        >
          Save
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
}
