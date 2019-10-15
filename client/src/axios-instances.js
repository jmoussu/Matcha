import axios from 'axios';

const baseApiUrl = 'http://localhost:3001';

const baseApi = axios.create({
  baseURL: baseApiUrl,
  timeout: 2000,
});

const testApi = axios.create({
  baseURL: 'https://reqres.in/',
});

const prepareBaseApiWithAuth = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: baseApiUrl,
    timeout: 2000,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { baseApi, testApi, prepareBaseApiWithAuth, baseApiUrl };
