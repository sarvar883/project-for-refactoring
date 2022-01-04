import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import RenderOrder from '../common/RenderOrder';
import { getRepeatOrders, repeatOrderNotNeeded } from '../../actions/operatorActions';


class RepeatOrders extends Component {
  state = {
    repeatOrders: []
  };

  componentDidMount() {
    this.props.getRepeatOrders(this.props.auth.user.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      repeatOrders: nextProps.operator.repeatOrders
    });
  }

  noNeed = (id) => {
    this.props.repeatOrderNotNeeded(id, this.props.history, this.props.auth.user.occupation);
  }

  render() {
    let renderOrders = this.state.repeatOrders.map((item, index) => {
      return (
        <React.Fragment key={index}>
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <RenderOrder
                    order={item}
                    shouldRenderIfOrderIsPovtor={false}
                    shouldRenderIfOrderIsFailed={false}
                    shouldRenderNextOrdersAfterFailArray={false}
                    shouldRenderDisinfector={true}
                    shouldRenderOperatorDecided={false}
                    shouldRenderAccountantDecided={false}
                    shouldRenderMaterialConsumption={false}
                    shouldRenderPaymentMethod={false}
                    shouldRenderUserAcceptedOrder={false}
                    shouldRenderUserCreated={false}
                    shouldRenderCompletedAt={true}
                  />

                  <li>Дата предыдущего заказа: <Moment format="DD/MM/YYYY">{item.previousOrder.dateFrom}</Moment></li>
                  <li>Срок гарантии (в месяцах): {item.previousOrder.guarantee}</li>
                  <li>Срок гарантии истекает: <Moment format="DD/MM/YYYY">{item.timeOfRepeat}</Moment></li>
                </ul>

                <button type="button" className="btn btn-primary mt-2" data-toggle="modal" data-target={`#info${index}`}>Полная информация о предыдущем заказе</button>

                <Link to={`/create-repeat-order-form/${item._id}`} className="btn btn-success mt-2">Повторная работа нужна</Link>

                <button className="btn btn-danger mt-2" onClick={() => { if (window.confirm('Вы  уверены?')) return this.noNeed(item._id) }}>Повторная работа не нужна</button>
              </div>
            </div>
          </div>

          <div className="modal fade" id={`info${index}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <ul className="font-bold mb-0 list-unstyled">
                    <RenderOrder
                      order={item}
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

                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Повторные заказы</h2>
          </div>
        </div>

        {this.props.operator.loadingSortedOrders ? <Spinner /> : (
          <div className="row">
            {renderOrders}
          </div>
        )}
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

export default connect(mapStateToProps, { getRepeatOrders, repeatOrderNotNeeded })(withRouter(RepeatOrders));