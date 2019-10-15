import React, { useState } from 'react';
import { connect } from 'react-redux';
import BioForm from './BioForm';
import { useForm, useField } from '../../shared/hooks';
import { Panel } from '../../shared/ui';
import TagContainer from './TagContainer';
import ImageContainer from './ImageContainer';
import { updateBio } from '../actions';

const bioValidation = [
  fdata => (fdata.bio.trim().length === 0 || fdata.bio > 255)
    && 'must contain at least something and 300 characters max',
];

function ProfilePanel({ bio, onUpdateBio }) {
  const [panelExpand, setPanelExpand] = useState(false);
  const bioForm = useForm(null);
  const bioField = useField('bio', bioForm, { validations: bioValidation }, bio || '');

  const handleBioSubmit = (e) => {
    e.preventDefault();
    if (bioForm.isValid) {
      onUpdateBio(bioField.value);
    }
  };

  return (
    <Panel
      expanded={panelExpand}
      title="profile"
      description="manage your profile"
      onChange={() => setPanelExpand(prev => !prev)}
    >
      <ImageContainer />
      <TagContainer />
      <BioForm
        fields={{ bioField: { ...bioField } }}
        onSubmit={handleBioSubmit}
      />
    </Panel>
  );
}

const mapStateToProps = state => ({
  bio: state.settings.profile.bio,
});

const mapDispatchToProps = dispatch => ({
  onUpdateBio: bioText => dispatch(updateBio(bioText)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePanel);
