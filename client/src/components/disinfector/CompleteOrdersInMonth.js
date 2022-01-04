import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import RenderOrder from '../common/RenderOrder';


class CompleteOrdersInMonth extends Component {
  state = {
    orders: this.props.order.completeOrdersInMonth
  };

  render() {
    let completeOrders = this.state.orders.map((order, index) => {
      return (
        <div className="col-md-6 mt-3" key={index}>
          <div className="card order">
            <div className="card-body p-0">
              <ul className="font-bold mb-0">
                <RenderOrder
                  order={order}
                  shouldRenderIfOrderIsPovtor={false}
                  shouldRenderIfOrderIsFailed={false}
                  shouldRenderNextOrdersAfterFailArray={false}
                  shouldRenderDisinfector={false}
                  shouldRenderOperatorDecided={true}
                  shouldRenderAccountantDecided={true}
                  shouldRenderMaterialConsumption={true}
                  shouldRenderPaymentMethod={true}
                  shouldRenderUserAcceptedOrder={true}
                  shouldRenderUserCreated={true}
                  shouldRenderCompletedAt={true}
                />
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="row m-0">
        {completeOrders}
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

export default connect(mapStateToProps)(withRouter(CompleteOrdersInMonth));