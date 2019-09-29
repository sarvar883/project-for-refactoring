import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import isEmpty from '../../validation/is-empty';

import { getDisinfectors, getOrderForEdit, editOrder } from '../../actions/orderActions';

class EditOrder extends Component {
  state = {
    _id: '',
    disinfectorId: '',
    client: '',
    address: '',
    date: '',
    timeFrom: '',
    phone: '',
    typeOfService: '',
    comment: '',
    errors: {}
  }

  componentDidMount() {
    this.props.getDisinfectors();
    this.props.getOrderForEdit(this.props.match.params.orderId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        order: nextProps.order,
        errors: nextProps.errors
      });
    }

    if (nextProps.order.orderById) {
      const orderForEdit = nextProps.order.orderById;

      orderForEdit.disinfectorId = !isEmpty(orderForEdit.disinfectorId) ? orderForEdit.disinfectorId : '';
      orderForEdit.client = !isEmpty(orderForEdit.client) ? orderForEdit.client : '';
      orderForEdit.address = !isEmpty(orderForEdit.address) ? orderForEdit.address : '';
      orderForEdit.phone = !isEmpty(orderForEdit.phone) ? orderForEdit.phone : '';
      orderForEdit.typeOfService = !isEmpty(orderForEdit.typeOfService) ? orderForEdit.typeOfService : '';
      orderForEdit.comment = !isEmpty(orderForEdit.comment) ? orderForEdit.comment : '';

      const date = !isEmpty(orderForEdit.dateFrom) ? new Date(orderForEdit.dateFrom) : '';

      let defaultDateMonth, defaultDateDay, defaultHourString;
      if (new Date(date).getMonth() < 10) {
        defaultDateMonth = `0${new Date(date).getMonth() + 1}`;
      } else {
        defaultDateMonth = `${new Date(date).getMonth() + 1}`;
      }

      if (new Date(date).getDate() < 10) {
        defaultDateDay = `0${new Date(date).getDate()}`;
      } else {
        defaultDateDay = new Date(date).getDate();
      }
      const defaultDateString = `${new Date(date).getFullYear()}-${defaultDateMonth}-${defaultDateDay}`;

      if (new Date(date).getHours() < 10) {
        defaultHourString = `0${new Date(date).getHours()}:00`;
      } else {
        defaultHourString = `${new Date(date).getHours()}:00`;
      }

      this.setState({
        _id: orderForEdit._id,
        disinfectorId: orderForEdit.disinfectorId._id,
        client: orderForEdit.client,
        address: orderForEdit.address,
        date: defaultDateString,
        timeFrom: defaultHourString,
        phone: orderForEdit.phone,
        typeOfService: orderForEdit.typeOfService,
        comment: orderForEdit.comment
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    const date = this.state.date.split('-');
    const dateStringFrom = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeFrom}`);

    let numberCharacters = 0;
    for (let i = 1; i <= 12; i++) {
      if (this.state.phone[i] >= '0' && this.state.phone[i] <= '9') {
        numberCharacters++;
      }
    }

    if (this.state.phone.length !== 13) {
      alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
    } else if (this.state.phone[0] !== '+') {
      alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
    } else if (numberCharacters !== 12) {
      alert('Телефонный номер должен содержать "+" и 12 цифр');
    } else {
      const order = {
        _id: this.state._id,
        disinfectorId: this.state.disinfectorId,
        client: this.state.client,
        address: this.state.address,
        date: this.state.date,
        dateFrom: dateStringFrom,
        timeFrom: this.state.timeFrom,
        phone: this.state.phone,
        typeOfService: this.state.typeOfService,
        comment: this.state.comment,
      };
      this.props.editOrder(order, this.props.history, this.props.auth.user.occupation);
    }
  }

  render() {
    const { errors } = this.state;
    const disinfectors = this.props.order.disinfectors ? this.props.order.disinfectors : [];
    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: 0 }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push(
      { label: worker.name, value: worker._id }
    ));

    const orderTypes = [
      { label: '-- Выберите тип заказа --', value: 0 },
      { label: 'DF', value: 'DF' },
      { label: 'DZ', value: 'DZ' },
      { label: 'KL', value: 'KL' },
      { label: 'TR', value: 'TR' },
      { label: 'GR', value: 'GR' },
      { label: 'MX', value: 'MX' },
      { label: 'KOMP', value: 'KOMP' }
    ];

    return (
      <React.Fragment>
        {this.props.order.loading ? <Spinner /> : (
          <div className="container edit-order mt-4" >
            <div className="row">
              <div className="col-md-8 m-auto">
                <div className="card">
                  <div className="card-body">
                    <h1 className="display-5 text-center">Редактировать Заказ</h1>
                    <form noValidate onSubmit={this.onSubmit}>
                      <TextFieldGroup
                        label="Введите Имя Клиента"
                        type="text"
                        name="client"
                        value={this.state.client}
                        onChange={this.onChange}
                        error={errors.client}
                      />
                      <TextFieldGroup
                        label="Адрес"
                        type="text"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        error={errors.address}
                      />
                      <TextFieldGroup
                        label="Дата выполнения заказа"
                        name="date"
                        type="date"
                        value={this.state.date}
                        onChange={this.onChange}
                        error={errors.date}
                      />
                      <TextFieldGroup
                        label="Время (часы:минуты:AM/PM) C"
                        name="timeFrom"
                        type="time"
                        value={this.state.timeFrom}
                        onChange={this.onChange}
                        error={errors.timeFrom}
                      />
                      <TextFieldGroup
                        label="Телефон"
                        type="phone"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                        error={errors.phone}
                      />
                      <label htmlFor="typeOfService">Выберите тип заказа</label>
                      <SelectListGroup
                        name="typeOfService"
                        value={this.state.typeOfService}
                        onChange={this.onChange}
                        error={errors.typeOfService}
                        options={orderTypes}
                      />
                      {this.props.order.loading ? (
                        <p>Дезинфекторы загружаются...</p>
                      ) : (
                          <div className="form-group">
                            <label htmlFor="disinfectorId">Выберите Дизинфектора:</label>
                            <select className="form-control" value={this.state.disinfectorId} name="disinfectorId" onChange={this.onChange}>
                              {disinfectorOptions.map((item, index) =>
                                <option key={index} value={item.value}>{item.label}</option>
                              )}
                            </select>
                          </div>
                        )}
                      <TextAreaFieldGroup
                        name="comment"
                        placeholder="Комментарии (Это поле не обязательное)"
                        value={this.state.comment}
                        onChange={this.onChange}
                        error={errors.comment}
                      />
                      <button type="submit" className="btn btn-primary">Редактировать</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getDisinfectors, getOrderForEdit, editOrder })(withRouter(EditOrder));