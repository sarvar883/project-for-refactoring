import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../common/Spinner';
import { getSortedOrders } from '../../actions/operatorActions';

import SortedOrders from './SortedOrders';

class Operator extends Component {
  state = {
    date: new Date(),
  }

  componentDidMount() {
    this.props.getSortedOrders(this.state.date);
  };

  onChange = (date) => this.setState({ date });

  onSubmit = (e) => {
    e.preventDefault();
    this.props.getSortedOrders(this.state.date);
  };

  render() {
    const { loadingSortedOrders } = this.props.operator;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 mt-4">
            <Calendar
              onChange={this.onChange}
              value={this.state.date}
            />
            <h4>Дата: <Moment format="DD/MM/YYYY">{this.state.date}</Moment></h4>
            <form onSubmit={this.onSubmit}>
              <button type="submit" className="btn btn-success mt-3">Посмотреть</button>
            </form>
          </div>
          <div className="col-lg-9">
            <h1 className="text-center">Заявки на <Moment format="DD/MM/YYYY">{this.props.operator.date}</Moment></h1>
            {loadingSortedOrders ? <Spinner /> : (
              <SortedOrders />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getSortedOrders })(withRouter(Operator));