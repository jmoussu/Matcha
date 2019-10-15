import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  registerPage: {
    // height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  registerSection: {
    width: '300px',
    margin: theme.spacing(3, 0),
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: theme.spacing(1),
  },
}));

export default useStyle;
