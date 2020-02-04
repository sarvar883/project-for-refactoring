import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../common/Spinner';
import { Swipeable } from 'react-swipeable';

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
    this.setState({
      date: date
    });
    this.props.getSortedOrders(date);
  };

  onSwiped = (direction) => {
    let newDate = new Date();
    if (direction === 'LEFT') {
      // add 1 day to state date
      newDate.setDate(this.state.date.getDate() + 1);
      this.setState({
        date: newDate
      });
    } else if (direction === 'RIGHT') {
      // decrement 1 day from state date
      newDate.setDate(this.state.date.getDate() - 1);
      this.setState({
        date: newDate
      });
    }
    this.props.getSortedOrders(this.state.date);
  };

  render() {
    const { loadingSortedOrders } = this.props.subadmin;

    return (
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Страница СубАдмина {this.props.auth.user.name}</h2>
          </div>
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
              <Swipeable
                trackMouse
                preventDefaultTouchmoveEvent
                onSwipedLeft={() => this.onSwiped('LEFT')}
                onSwipedRight={() => this.onSwiped('RIGHT')}
                delta={120}
              >
                <SubadmSortedOrders date={this.state.date} />
              </Swipeable>
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