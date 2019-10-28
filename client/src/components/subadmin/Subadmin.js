import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../common/Spinner';

import { getSortedOrders } from '../../actions/subadminActions';

import SubadmSortedOrders from './SubadmSortedOrders';

class Subadmin extends Component {
  state = {
    date: new Date()
  }

  componentDidMount() {
    this.props.getSortedOrders(this.state.date);
  };

  onChange = (date) => {
    let today = new Date().setHours(0, 0, 0, 0);
    if (date < today) {
      alert('Нельзя смотреть прошедшие дни');
    } else {
      this.setState({
        date: date
      });
      this.props.getSortedOrders(date);
    }
  };

  render() {
    const { loadingSortedOrders } = this.props.subadmin;

    return (
      <div className="container-fluid mt-1">
        <div className="row">
          <h2 className="m-auto">Страница СубАдмина {this.props.auth.user.name}</h2>
        </div>

        <div className="row">
          <div className="col-lg-3 mt-4 calendar">
            <div className="sticky-top">
              <Calendar
                onChange={this.onChange}
                value={this.state.date}
              />
            </div>
          </div>
          <div className="col-lg-9">
            <h1 className="text-center">Заявки на <Moment format="DD/MM/YYYY">{this.state.date}</Moment></h1>

            {loadingSortedOrders ? <Spinner /> : (
              <SubadmSortedOrders date={this.state.date} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getSortedOrders })(withRouter(Subadmin));