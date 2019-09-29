import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

class Navbar extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <div className="authLinks">
        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Чат</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link to="/chat" className="nav-link">Чат</Link>
            </li>
            <li className="nav-item">
              <Link to="/anons" className="nav-link">Анонсы</Link>
            </li>
          </div>
        </div>

        <li className="nav-item list-inline-item">
          <Link to="/login" onClick={this.onLogoutClick} className="nav-link logout">
            Logout
          </Link>
        </li>
      </div>
    );

    const guestLinks = (
      <div className="guestLinks">
        <li className="nav-item list-inline-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </div>
    );

    const disinfectorLinks = (
      <div className="disinfectorLinks">

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/stats">Статистика</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/queries">Запросы</Link>
            </li>
          </div>
        </div>
      </div>
    );

    const operatorLinks = (
      <div className="operatorLinks">
        <li className="nav-item mr-2 list-inline-item">
          <Link className="nav-link" to="/create-order">
            Создать заказ
          </Link>
        </li>
        <li className="nav-item mr-2 list-inline-item">
          <Link className="nav-link" to="/operator/order-queries">
            Запросы
          </Link>
        </li>
      </div>
    );

    const adminLinks = (
      <div className="adminLinks">
        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/stats">Общая Статистика</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/disinf-stats">Статистика Дезинфекторов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/order-queries">Запросы</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Материалы</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-coming-history">История Приходов Материалов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-history">История Раздач Материалов</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Добавить</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-coming">Приход Материалов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/materials">Материалы Дезинфектору</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Новый Пользователь</Link>
            </li>
          </div>
        </div>
      </div>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary pt-0 pb-0" id="navbar">
        <div className="container pt-2 pb-2 pl-0 pr-0">
          <Link to={`/${user.occupation}`} className="navbar-brand p-2">Pro Team</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse">
            <img src="../img/hamburger.svg" className="hamburger" alt="Hamburger" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto list-inline">
              {user.occupation === 'admin' ? adminLinks : ('')}
              {user.occupation === 'disinfector' ? disinfectorLinks : ('')}
              {user.occupation === 'operator' ? operatorLinks : ('')}
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(withRouter(Navbar));