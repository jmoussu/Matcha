import { baseApi, prepareBaseApiWithAuth } from '../../axios-instances';
import socket from '../socket';

export function register(data) {
  return baseApi.post('accounts/sign_up', data).then(
    response => response.data,
  );
}

export async function login(email, password) {
  const payload = { email, password };
  try {
    const response = await baseApi.post('accounts/sign_in', payload);
    localStorage.setItem('token', response.data.token);
    socket.emit('connected', { id: response.data.token });
    // socket.on('online', data => console.log('online ' + data));
    // socket.on('offline', data => console.log('offline ' + data));
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
}

export function logout() {
  socket.emit('disconnected');
  localStorage.removeItem('token');
}

export function sendResetPasswordEmail(mail) {
  return baseApi.post('accounts/password_reset/send_email', { email: mail }).then(
    response => response.data,
  );
}

export async function EmailExists(mail) {
  try {
    await baseApi.post('accounts/verif_email', { email: mail });
    return true;
  } catch (err) {
    return false;
  }
}

export async function UpdatePasswordAfterReset(mail, pswd, tkn) {
  const config = {
    headers: { Authorization: `Bearer ${tkn}` },
  };
  try {
    await baseApi.post('accounts/password_reset/change_password', {
      email: mail,
      password: pswd,
    }, config);
    return true;
  } catch (err) {
    return false;
  }
}

export async function signWithToken() {
  try {
    const api = prepareBaseApiWithAuth();
    const resp = await api.post('accounts/relog');
    socket.emit('connected', { id: resp.data.token });
    // socket.on('online', data => console.log('online ' + data));
    // socket.on('offline', data => console.log('offline ' + data));
    localStorage.setItem('token', resp.data.token);
    return resp.data;
  } catch (err) {
    // console.log(err);
    throw err.response.data;
  }
}
