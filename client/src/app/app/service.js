import { baseApi } from '../../axios-instances';

async function getAllTags() {
  try {
    const resp = await baseApi.get('/tags/get_tags');
    return resp.data.tags;
  } catch (err) {
    throw err.response;
  }
}

export default {
  getAllTags,
};
