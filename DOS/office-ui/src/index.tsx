import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import App from './App';
import { configureStore } from './store';
import { setAppSettings } from './shared/utils/app-settings.util';
import reportWebVitals from './reportWebVitals';

const initialState: any = {};
const store: any = configureStore(initialState, {});
const theme: Theme = createTheme();
const appSettings = {
  authUrl:
    process.env.NODE_ENV === 'production'
      ? `${process.env.REACT_APP_HOST_AUTH}`
      : process.env.REACT_APP_HOST_AUTH || 'http://localhost:10090/v1', // @todo this should be fetch from docker image container env vars
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? `${process.env.REACT_APP_HOST_API}`
      : process.env.REACT_APP_HOST_API || 'http://localhost:8081', // @todo this should be fetch from docker image container env vars
};

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log(process.env);
}

setAppSettings(Object.freeze(appSettings));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
