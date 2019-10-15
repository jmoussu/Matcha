import React from 'react';
import GeneralSettingsPanel from './components/GeneralPanel';
import SearchPreferencesPanel from './components/SearchPanel';
import PasswordPanel from './components/PasswordPanel';
import ProfilePanel from './components/ProfilePanel';
import LocationPanel from './components/LocationPanel';

function SettingsContainer() {
  return (
    <div>
      <ProfilePanel />
      <GeneralSettingsPanel />
      <SearchPreferencesPanel />
      <PasswordPanel />
      <LocationPanel />
    </div>
  );
}

export default SettingsContainer;
