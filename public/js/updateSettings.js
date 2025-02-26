import axios from 'axios';
import { showAlert } from './alert';

export const changeUserData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8000/api/v1/users/update-password'
        : 'http://127.0.0.1:8000/api/v1/users/update-info';

    const res = await axios({
      method: 'patch',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} UPDATED SUCCESSFULLY`);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
