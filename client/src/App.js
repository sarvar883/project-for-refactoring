import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';

// import routes
import StartPage from './components/common/StartPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import SubadminRoute from './components/common/SubadminRoute'
import OperatorRoute from './components/common/OperatorRoute';
import AccountantRoute from './components/common/AccountantRoute';
import DisinfectorRoute from './components/common/DisinfectorRoute';

// Components
import Navbar from './components/layout/Navbar';

import Admin from './components/admin/Admin';
import AdminStats from './components/admin/AdminStats';
import AdvStats from './components/admin/AdvStats';
import DisStats from './components/admin/DisStats';
import OperStats from './components/admin/OperStats';
import AdminQueries from './components/admin/AdminQueries';
import AdminMaterials from './components/admin/AdminMaterials';
import EditOrder from './components/common/EditOrder';
import MatComing from './components/admin/MatComing';
import MatComHistory from './components/admin/MatComHistory';
import MaterialHistory from './components/admin/MaterialHistory';
import AdmClients from './components/admin/AdmClients';

import Subadmin from './components/subadmin/Subadmin';

import Disinfector from './components/disinfector/Disinfector';
import DisinfQueries from './components/disinfector/DisinfQueries';
import DisinfStats from './components/disinfector/DisinfStats';
import OrderComplete from './components/disinfector/OrderComplete';

import Operator from './components/operator/Operator';
import CreateOrder from './components/operator/CreateOrder';
import OrderDetails from './components/operator/OrderDetails';
import OrderQueries from './components/operator/OrderQueries';
import ConfirmOrder from './components/operator/ConfirmOrder';

import Accountant from './components/accountant/Accountant';

import Chat from './components/chat/Chat';
import ChatRoom from './components/chat/ChatRoom';
import Anons from './components/chat/Anons';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

// CSS
import './App.css';


// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/login" component={Login} />

            <Switch>
              <StartPage exact path="/" />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/anons" component={Anons} />
            </Switch>


            {/* Admin Routes */}
            <Switch>
              <AdminRoute exact path="/admin" component={Admin} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/register" component={Register} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/stats" component={AdminStats} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/adv-stats" component={AdvStats} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/disinf-stats" component={DisStats} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/operator-stats" component={OperStats} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/order-queries" component={AdminQueries} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/materials" component={AdminMaterials} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-coming" component={MatComing} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-coming-history" component={MatComHistory} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-history" component={MaterialHistory} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/edit-order/:orderId" component={EditOrder} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/clients" component={AdmClients} />
            </Switch>


            {/* Subadmin Routes */}
            <Switch>
              <SubadminRoute exact path="/subadmin" component={Subadmin} />
            </Switch>


            {/* DisinfectorRoutes */}
            <Switch>
              <DisinfectorRoute exact path="/disinfector" component={Disinfector} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/order-complete-form/:id" component={OrderComplete} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/queries" component={DisinfQueries} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/stats" component={DisinfStats} />
            </Switch>


            {/* OperatorRoutes */}
            <Switch>
              <OperatorRoute exact path="/operator" component={Operator} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/create-order" component={CreateOrder} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/order-details/:id" component={OrderDetails} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/operator/order-queries" component={OrderQueries} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/order-confirm/:id" component={ConfirmOrder} />
            </Switch>


            {/* Accountant Routes */}
            <Switch>
              <AccountantRoute exact path="/accountant" component={Accountant} />
            </Switch>


            {/* Chat Routes */}
            <Switch>
              <PrivateRoute exact path="/chat" component={Chat} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/chat/:chatId" component={ChatRoom} />
            </Switch>

          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;