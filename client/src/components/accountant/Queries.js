import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import RenderOrder from '../common/RenderOrder';
import { getAccountantQueries } from '../../actions/accountantActions';

class Queries extends Component {
  state = {
    queries: []
  };

  componentDidMount() {
    this.props.getAccountantQueries();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountant.queries) {
      this.setState({
        queries: nextProps.accountant.queries
      });
    }
  }

  render() {
    const { queries } = this.state;

    let renderQueries = queries.map((item, key) => {
      return (
        <div className="col-lg-4 col-md-6 mt-2" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <RenderOrder
                  order={item}
                  shouldRenderIfOrderIsPovtor={false}
                  shouldRenderIfOrderIsFailed={false}
                  sholdRenderIfOrderIsReturned={true}
                  shouldRenderNextOrdersAfterFailArray={false}
                  shouldRenderDisinfector={true}
                  shouldRenderOperatorDecided={true}
                  shouldRenderAccountantDecided={false}
                  shouldRenderMaterialConsumption={false}
                  shouldRenderPaymentMethod={false}
                  shouldRenderUserAcceptedOrder={false}
                  shouldRenderUserCreated={false}
                  shouldRenderCompletedAt={true}
                />
              </ul>

              <Link to={`/accountant/order-confirm/${item._id}`} className="btn btn-dark">Форма Подтверждения</Link>
            </div>
          </div>
        </div>
      );
    });


    return (
      <div className="container-fluid">
        <div className="row m-0">
          <h2 className="m-auto">Запросы</h2>
        </div>

        <div className="row m-0">
          {this.props.accountant.loadingQueries ?
            <div className="col-12">
              <Spinner />
            </div>
            :
            renderQueries
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  accountant: state.accountant,
  errors: state.errors
});

export default connect(mapStateToProps, { getAccountantQueries })(withRouter(Queries));