import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrders } from '../../actions/orderActions';
import { getDisinfectorMaterials } from '../../actions/disinfectorActions';
import Spinner from '../common/Spinner';
import DisplayOrders from './DisplayOrders';

class Disinfector extends Component {
  componentDidMount() {
    this.props.getDisinfectorMaterials(this.props.auth.user.id);
    this.props.getOrders(this.props.auth.user.id);
  }

  render() {
    let currentMaterials = this.props.auth.user.materials.map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Страница Дезинфектора {this.props.auth.user.name}</h1>
            </div>
          </div>

          {this.props.auth.loadingUser ? <Spinner /> : (
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Ваши имеющиеся материалы</h3>
              </div>

              <div className="col-md-6 mx-auto mt-3">
                <div className="card order">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 pl-3">
                      {currentMaterials}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container-fluid">
          {this.props.order.loading ? <Spinner /> : (
            <div className="row">
              <div className="col-12">
                <h2 className="text-center mt-3">Ваши Заказы</h2>
              </div>
              <DisplayOrders />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrders, getDisinfectorMaterials })(withRouter(Disinfector));