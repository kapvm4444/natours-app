import '@babel/polyfill';
import env from 'dotenv';
import { loadGoogleMaps } from './loadGoogleMaps';
import { login, logout } from './login';
import { setGoogleMap } from './googleMap';
import { setMapboxMap } from './mapboxMap';
import { changeUserData } from './updateSettings';

env.config({ path: `${__dirname}/../../config.env` });
console.log(env, process);
console.log(process.env, __dirname, __filename);

console.log(process.env);

//=>
// Loading this right away because googleMap.js need this before executing
loadGoogleMaps({
  key: 'AIzaSyBQTySjU1pXeQ7tp_u5V8x4woGztpRlrAg',
  v: 'weekly',
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

//label
// Elements
const mapElement = document.getElementById('map');
const loginFormElement = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav_el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//label
// Variables
const mapApiType = 'Mapbox';

//label
// Calling the methods when needed
//=>
// for loading the map
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  if (mapApiType === 'Google') setGoogleMap(locations);
  if (mapApiType === 'Mapbox') setMapboxMap(locations);
}

//=>
// for logging in the users
if (loginFormElement) {
  loginFormElement.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}

//=>
// For Logging Out users
if (logoutButton) logoutButton.addEventListener('click', logout);

//=>
// Change the user data in account page
if (userDataForm) {
  userDataForm.addEventListener('submit', async (evt) => {
    document.querySelector('.btn--info').innerHTML =
      '<div class="spinner-border text-light" role="status"></div>';

    evt.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await changeUserData(form, 'data');

    window.setTimeout(() => {
      document.querySelector('.btn--info').innerHTML = 'Save Setting';
    }, 1000);
  });
}

//=>
// Update the user password
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (evt) => {
    document.querySelector('.btn--password').innerHTML =
      '<div class="spinner-border text-light" role="status"></div>';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    evt.preventDefault();
    await changeUserData(
      { currentPassword, newPassword, newPasswordConfirm },
      'password',
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    window.setTimeout(() => {
      document.querySelector('.btn--info').innerHTML = 'Save Password';
    }, 1000);
  });
}
