import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/js/App';

import './assets/styles//index.css';
import './assets/styles/salesforce-lightning-design-system.css';
import './assets/styles/react-super-select.css';
import './assets/styles/react-dropdown-multiselect.css';
import './assets/styles/custom-styles.css';
import './assets/styles/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-notifications/lib/notifications.css';
import './assets/styles/loginstyle.css';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);