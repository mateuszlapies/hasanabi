import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import Router from "./packages/Router";
import Context from "./packages/Context";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Context>
            <Router/>
        </Context>
    </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
