import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { getCompleteOrders } from '../../actions/operatorActions';

import ShowOrderQueries from './ShowOrderQueries';

class OrderQueries extends Component {
  componentDidMount() {
    this.props.getCompleteOrders(this.props.auth.user.id);
  }

  render() {
    return (
      <div className="container-fluid">
        {/* {this.props.operator.loadingCompleteOrders ? <Spinner /> : <ShowOrderQueries />} */}
        {<ShowOrderQueries orders={this.props.orders} />}
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

export default connect(mapStateToProps, { getCompleteOrders })(withRouter(OrderQueries));