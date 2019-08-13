import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';

// import routes
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import OperatorRoute from './components/common/OperatorRoute';
import AccountantRoute from './components/common/AccountantRoute';
import DisinfectorRoute from './components/common/DisinfectorRoute';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Admin from './components/admin/Admin';
import Disinfector from './components/disinfector/Disinfector';
import DisinfQueries from './components/disinfector/DisinfQueries';
import DisinfStats from './components/disinfector/DisinfStats';
import CreateOrder from './components/operator/CreateOrder';
import OrderDetails from './components/operator/OrderDetails';
import OrderComplete from './components/disinfector/OrderComplete';
import OrderQueries from './components/operator/OrderQueries';
import ConfirmOrder from './components/operator/ConfirmOrder';
import Chat from './components/chat/Chat';
import ChatRoom from './components/chat/ChatRoom';
import Anons from './components/chat/Anons';
import Operator from './components/operator/Operator';
import Accountant from './components/accountant/Accountant';

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
              <PrivateRoute exact path="/" component={Landing} />
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