import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Paper } from '../../shared/ui';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';
import { addImage, removeImage, setAvatar } from '../actions';
import { selectors } from '../reducer';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
  },
}));

function ImageContainer({
  onUploadImage,
  onRemoveImage,
  onSetAvatar,
  images,
}) {
  const classes = useStyle();

  const handleFiles = (files) => {
    if (!!files === false) return;
    if (files.length === 0) return;
    const formData = new FormData();
    const file = files[0];
    formData.set('img', file);
    onUploadImage(formData);
  };

  const handleImageRemove = (imgPath) => {
    onRemoveImage(imgPath);
  };

  const handleImageAvatar = (imgPath) => {
    // console.log(`set as avatar: ${imgPath}`);
    onSetAvatar(imgPath);
  };

  return (
    <Paper className={classes.root}>
      <ImageList
        images={images}
        onImageRemove={handleImageRemove}
        onImageSetAsAvatar={handleImageAvatar}
      />
      <ImageUploader onFilesChoose={handleFiles} />
    </Paper>
  );
}

const mapStateToProps = state => ({
  images: selectors.getUserImages(state),
});

const mapDispatchToProps = dispatch => ({
  onUploadImage: imgForm => dispatch(addImage(imgForm)),
  onRemoveImage: imgPath => dispatch(removeImage(imgPath)),
  onSetAvatar: imgPath => dispatch(setAvatar(imgPath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageContainer);
