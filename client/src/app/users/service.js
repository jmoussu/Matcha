import { prepareBaseApiWithAuth } from '../../axios-instances';

export async function getUserInfos(id) {
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.get(`accounts/get/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export async function toggleLike(id, like) {
  const url = like
    ? 'likes/add'
    : 'likes/remove';
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.post(url, { id_profil: id });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export default {
  getUserInfos,
};
