import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import DisinfectorRoute from './components/common/DisinfectorRoute';
import OperatorRoute from './components/common/OperatorRoute';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Admin from './components/admin/Admin';
import Disinfector from './components/disinfector/Disinfector';
import CreateOrder from './components/operator/CreateOrder';
import Chat from './components/chat/Chat';
import ChatRoom from './components/chat/ChatRoom';
import Anons from './components/chat/Anons';
import Operator from './components/operator/Operator';

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

            <PrivateRoute exact path="/register" component={Register} />


            {/* DisinfectorRoutes */}
            <Switch>
              <DisinfectorRoute exact path="/disinfector" component={Disinfector} />
            </Switch>

            {/* OperatorRoutes */}
            <Switch>
              <OperatorRoute exact path="/operator" component={Operator} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/create-order" component={CreateOrder} />
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