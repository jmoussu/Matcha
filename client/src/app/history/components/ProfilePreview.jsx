import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { baseApiUrl } from '../../../axios-instances';

import TagList from '../../users/profile/components/TagList';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    width: '100%',
    margin: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function ProfilePreview({
  bio,
  online,
  age,
  image,
  tags,
  firstName,
  onClick,
  sex,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.card} onClick={onClick}>
      <CardHeader
        avatar={(
          <Avatar aria-label="recipe" className={classes.avatar}>
            {age}
          </Avatar>
        )}
        title={firstName}
        subheader={online ? 'online' : 'offline'}
      />
      <CardMedia
        className={classes.media}
        image={(image && `${baseApiUrl}/${image}`) || 'https://www.is.mpg.de/assets/noEmployeeImage_md-eaa7c21cc21b1943d77e51ab00a5ebe9.png'}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {bio}
        </Typography>
        <Typography variant="body2">
          {sex}
        </Typography>
        <TagList tags={tags} />
      </CardContent>
    </Card>
  );
}
