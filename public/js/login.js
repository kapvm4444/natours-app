import { showAlert } from './alert';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Login Successful');
      window.setTimeout(() => {
        location.replace('/');
      }, 1000);
    }
  } catch (e) {
    console.log(e);
    showAlert('error', e.response.data.message || 'something is off');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Logged Out');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (e) {
    showAlert('error', e.response.status);
    console.log(e);
  }
};
