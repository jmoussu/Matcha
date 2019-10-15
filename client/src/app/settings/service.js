import { prepareBaseApiWithAuth } from '../../axios-instances';

export async function updateAccountSettings(settings) {
  try {
    const api = prepareBaseApiWithAuth();
    const response = await api.post('accounts/update/info', settings);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export async function updateSearchPreferences(searchPref) {
  try {
    const api = prepareBaseApiWithAuth();
    const response = await api.post('accounts/update/preferences', searchPref);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export async function createTag(tag) {
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.post('/accounts/update/tags/add', tag);
    return response.data.tags;
  } catch (err) {
    throw err.response.data;
  }
}

export async function deleteTag(tag) {
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.post('/accounts/update/tags/remove', tag);
    return response.data.tags;
  } catch (err) {
    throw err.response.data;
  }
}

export async function updateBio(bioText) {
  try {
    const api = prepareBaseApiWithAuth();
    const response = await api.post('accounts/update/bio', { bio: bioText });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export async function updatePassword(passInfos) {
  try {
    const api = prepareBaseApiWithAuth();
    const response = await api.post('accounts/update/password', passInfos);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export async function uploadImage(formData) {
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.post('accounts/update/pics/add', formData);
    return response.data.pics;
  } catch (err) {
    throw err.response.data;
  }
}

export async function deleteImage(imgPath) {
  const api = prepareBaseApiWithAuth();
  const payload = { path: imgPath };
  try {
    const response = await api.post('accounts/update/pics/remove', payload);
    return response.data.pics;
  } catch (err) {
    throw err.response.data;
  }
}

export async function setAvatar(imgPath) {
  const api = prepareBaseApiWithAuth();
  const payload = { path: imgPath };
  try {
    const response = await api.post('accounts/update/pics/set_avatar', payload);
    return response.data.pics;
  } catch (err) {
    throw err.response.data;
  }
}
