import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import RenderOrder from '../common/RenderOrder';
import { getOrderById } from '../../actions/orderActions';


class OrderFullDetails extends Component {
  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
  }

  render() {
    const order = this.props.order.orderById;

    return (
      <div className="container">
        {this.props.order.loading ? <Spinner /> : (
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Детали Заказа</h1>
            </div>

            <div className="col-lg-8 col-md-10 m-auto">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 list-unstyled">
                    <RenderOrder
                      order={order}
                      shouldRenderIfOrderIsPovtor={false}
                      shouldRenderIfOrderIsFailed={false}
                      shouldRenderNextOrdersAfterFailArray={false}
                      shouldRenderDisinfector={true}
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
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById })(withRouter(OrderFullDetails));