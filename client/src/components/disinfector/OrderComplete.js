import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import { getOrderById, submitCompleteOrder } from '../../actions/orderActions';
import { getDisinfectorMaterials } from '../../actions/disinfectorActions';
import materials from '../common/materials';

class OrderComplete extends Component {
  state = {
    array: [{}],
    consumption: [
      {
        material: '',
        amount: '',
        unit: ''
      }
    ],
    paymentMethod: '',
    invoice: '',
    cost: '',

    // materials disinfector currently has
    currentMaterials: this.props.auth.user.materials
  };

  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
    this.props.getDisinfectorMaterials(this.props.auth.user.id);
    window.scrollTo({ top: 0 });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  changeSelect = (e) => {
    const index = e.target.name.split('-')[1];
    let newConsumptionArray = this.state.consumption;
    newConsumptionArray[index].material = e.target.value.split('+')[0];
    newConsumptionArray[index].unit = e.target.value.split('+')[1];
    this.setState({
      consumption: newConsumptionArray
    });
  }

  changeAmount = (e) => {
    const index = e.target.name.split('-')[1];
    let newConsumptionArray = this.state.consumption;
    newConsumptionArray[index].amount = e.target.value;
    this.setState({
      consumption: newConsumptionArray
    });
  }

  addMaterial = (e) => {
    e.preventDefault();
    let newArray = this.state.array;
    newArray.push({});
    let newConsumption = this.state.consumption;
    newConsumption.push({
      material: '',
      amount: '',
      unit: ''
    });
    this.setState({
      array: newArray,
      consumption: newConsumption
    });
  }

  deleteMaterial = (e) => {
    e.preventDefault();
    let newArray = this.state.array;
    newArray.pop();
    let newConsumption = this.state.consumption;
    newConsumption.pop();
    this.setState({
      array: newArray,
      consumption: newConsumption
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    let hasEmptyFields = false, notEnoughMaterials = false;
    this.state.consumption.forEach(item => {
      if (item.material === '') {
        hasEmptyFields = true;
      }
      this.state.currentMaterials.forEach(element => {
        if (element.material === item.material && element.unit === item.unit && element.amount < item.amount) {
          notEnoughMaterials = true;
        }
      });
    });
    if (hasEmptyFields) {
      alert('Заполните Поле "Расход Материалов"');
    } else if (notEnoughMaterials) {
      alert('У вас недостатотчно материалов');
    } else {
      const object = {
        disinfectorId: this.props.auth.user.id,
        orderId: this.props.match.params.id,
        consumption: this.state.consumption,
        paymentMethod: this.state.paymentMethod,
        invoice: this.state.invoice,
        cost: this.state.cost
      };
      this.props.submitCompleteOrder(object, this.props.history);
    }
  };

  render() {
    const order = this.props.order.orderById;

    let consumptionMaterials = [
      { label: '-- Выберите вещество --', value: "", unit: "" }
    ];

    materials.forEach(item => {
      consumptionMaterials.push({
        label: item.material,
        value: item.material,
        unit: item.unit
      })
    });

    const consumptionOptions = consumptionMaterials.map((option, index) =>
      <option value={`${option.value}+${option.unit}`} key={index}>{option.label} {option.unit}</option>
    );

    let renderConsumption = this.state.array.map((item, index) =>
      <React.Fragment key={index}>
        <div className="form-group">
          <select name={`consumption-${index}`} className="form-control" onChange={this.changeSelect} required>
            {consumptionOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`quantity-${index}`}>Количество:</label>
          <input
            type="number"
            step="0.001"
            className="form-control"
            name={`quantity-${index}`}
            onChange={this.changeAmount}
            required
          />
        </div>
        <hr />
      </React.Fragment>
    );

    let currentMaterials = this.state.currentMaterials.map((item, index) =>
      <li key={index}>{item.material}: {item.amount} {item.unit}</li>
    );

    return (
      <div className="container p-0">
        {this.props.order.loading ? <Spinner /> : (
          <div className="row m-0">

            <div className="col-md-6">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <h3 className="text-center">Заказ</h3>
                  <ul className="font-bold">
                    <li className="pb-2">Дезинфектор: {order.disinfectorId.name}</li>
                    <li className="pb-2">Клиент: {order.client}</li>
                    <li className="pb-2">Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li className="pb-2">Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                    <li className="pb-2">Адрес: {order.address}</li>
                    <li className="pb-2">Тип услуги: {order.typeOfService}</li>
                    <li className="pb-2">Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                    <li className="pb-2">Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
                    <li className="pb-2">Заказ Добавлен: <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <h3 className="text-center">У вас имеется в наличии материалов:</h3>
                  <ul className="font-bold">
                    {currentMaterials}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row m-0">
          <div className="col-lg-8 col-md-10 m-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body">
                <h1 className="text-center">Форма о Выполнении Заказа</h1>
                <form onSubmit={this.onSubmit}>
                  <label htmlFor="consumption">Расход Материалов:</label>
                  {renderConsumption}
                  {this.state.array.length < materials.length ? <button className="btn btn-primary mr-2" onClick={this.addMaterial}>Добавить Материал</button> : ''}
                  {this.state.array.length === 1 ? '' : <button className="btn btn-danger" onClick={this.deleteMaterial}>Удалить последний материал</button>}
                  <hr />
                  <div className="form-group">
                    <select name="paymentMethod" className="form-control" onChange={this.onChange} required>
                      <option value="">-- Выберите Тип Платежа --</option>
                      <option value="Наличный">Наличный</option>
                      <option value="Безналичный">Безналичный</option>
                    </select>
                  </div>

                  {this.state.paymentMethod === 'Безналичный' ? (
                    <div className="form-group">
                      <label htmlFor="invoice">Счет-Фактура:</label>
                      <input type="number" className="form-control" name="invoice" onChange={this.onChange} required />
                    </div>
                  ) : ''}

                  <div className="form-group">
                    <label htmlFor="cost">Общая Сумма: (UZS)</label>
                    <input type="number" className="form-control" name="cost" onChange={this.onChange} required />
                  </div>
                  <button className="btn btn-success btn-block">Отправить Запрос О Выполнении</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById, getDisinfectorMaterials, submitCompleteOrder })(withRouter(OrderComplete));