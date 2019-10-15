import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  '@keyframes onAppear': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  root: {
    animation: '$onAppear 2s ease-out',
    opacity: 1,
  },
}));

export default useStyle;
