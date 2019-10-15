import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    margin: theme.spacing(1, 0),
  },
}));

export default useStyle;
