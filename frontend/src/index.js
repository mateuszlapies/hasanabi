import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import Routing from "./packages/Routing";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Routing/>
    </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
