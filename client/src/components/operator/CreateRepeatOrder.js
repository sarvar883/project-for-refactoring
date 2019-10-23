import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import advertisements from '../common/advertisements';

import { getDisinfectors, getRepeatOrderForm, createRepeatOrder } from '../../actions/orderActions';

class CreateRepeatOrder extends Component {
  state = {
    disinfectorId: '',
    client: '',
    address: '',
    date: '',
    timeFrom: '',
    phone: '',
    typeOfService: '',
    advertising: '',
    comment: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getRepeatOrderForm(this.props.match.params.orderId);
    this.props.getDisinfectors();
    window.scrollTo({ top: 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.order.repeatOrder) {
      let newOrder = nextProps.order.repeatOrder;

      this.setState({
        disinfectorId: newOrder.disinfectorId._id ? newOrder.disinfectorId._id : '',
        client: newOrder.client ? newOrder.client : '',
        address: newOrder.address ? newOrder.address : '',
        phone: newOrder.phone ? newOrder.phone : '',
        typeOfService: newOrder.typeOfService ? newOrder.typeOfService : '',
        advertising: newOrder.advertising ? newOrder.advertising : ''
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
      const newOrder = {
        id: this.props.match.params.orderId,
        disinfectorId: this.state.disinfectorId,
        client: this.state.client,
        address: this.state.address,
        date: this.state.date,
        dateFrom: dateStringFrom,
        timeFrom: this.state.timeFrom,
        phone: this.state.phone,
        typeOfService: this.state.typeOfService,
        advertising: this.state.advertising,
        comment: this.state.comment,
        userCreated: this.props.auth.user.id
      };
      console.log('newOrder', newOrder);
      this.props.createRepeatOrder(newOrder, this.props.history, this.props.auth.user.occupation);
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

    const advOptions = [
      { label: '-- Откуда узнали о нас? --', value: 0 }
    ];

    advertisements.forEach(item => {
      advOptions.push({
        label: item.label,
        value: item.value
      });
    });

    return (
      <React.Fragment>
        {this.props.order.loadingRepeatOrder ? <Spinner /> : (
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-8 m-auto">
                <div className="card">
                  <div className="card-body">
                    <h1 className="display-5 text-center">Создать Повторный Заказ</h1>
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
                        onChange={this.onChange}
                        error={errors.date}
                      />
                      <TextFieldGroup
                        label="Время (часы:минуты:AM/PM) C"
                        name="timeFrom"
                        type="time"
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
                      <SelectListGroup
                        name="advertising"
                        value={this.state.advertising}
                        onChange={this.onChange}
                        error={errors.advertising}
                        options={advOptions}
                      />
                      {this.props.order.loading ? (
                        <p>Дезинфекторы загружаются...</p>
                      ) : (
                          <div className="form-group">
                            <label htmlFor="disinfectorId">Выберите Дезинфектора:</label>
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
                      <button type="submit" className="btn btn-primary">Создать Повторный Заказ</button>
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
  operator: state.operator,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getDisinfectors, getRepeatOrderForm, createRepeatOrder })(withRouter(CreateRepeatOrder));