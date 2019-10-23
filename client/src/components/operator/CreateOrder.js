import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDisinfectors, createOrder } from '../../actions/orderActions';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import advertisements from '../common/advertisements';

class CreateOrder extends Component {
  constructor(props) {
    super(props);

    let date, hour;

    if (this.props.location.state) {
      date = this.props.location.state.state.date;
      hour = this.props.location.state.state.hour;
    } else {
      date = '';
      hour = '';
    }

    this.state = {
      disinfectorId: '',
      client: '',
      address: '',
      date: date,
      timeFrom: hour,
      phone: '',
      hasSecondPhone: false,
      phone2: '',
      typeOfService: '',
      advertising: '',
      comment: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getDisinfectors();
    window.scrollTo({ top: 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  toggleSecondPhone = (e) => {
    e.preventDefault();
    this.setState({
      hasSecondPhone: !this.state.hasSecondPhone
    });
  }

  deleteSecondPhone = (e) => {
    e.preventDefault();
    this.setState({
      hasSecondPhone: false,
      phone2: ''
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const date = this.state.date.split('-');
    const dateStringFrom = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeFrom}`);

    let numberCharacters = 0, phone2Characters = 0;
    for (let i = 1; i <= 12; i++) {
      if (this.state.phone[i] >= '0' && this.state.phone[i] <= '9') {
        numberCharacters++;
      }
      if (this.state.phone2[i] >= '0' && this.state.phone2[i] <= '9') {
        phone2Characters++;
      }
    }

    if (this.state.phone.length !== 13 || (this.state.hasSecondPhone && this.state.phone2.length !== 13)) {
      alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
    } else if (this.state.phone[0] !== '+' || (this.state.hasSecondPhone && this.state.phone2[0] !== '+')) {
      alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
    } else if (numberCharacters !== 12 || (this.state.hasSecondPhone && phone2Characters !== 12)) {
      alert('Телефонный номер должен содержать "+" и 12 цифр');
    } else {
      const newOrder = {
        disinfectorId: this.state.disinfectorId,
        client: this.state.client,
        address: this.state.address,
        date: this.state.date,
        dateFrom: dateStringFrom,
        timeFrom: this.state.timeFrom,
        phone: this.state.phone,
        phone2: this.state.phone2,
        typeOfService: this.state.typeOfService,
        advertising: this.state.advertising,
        comment: this.state.comment,
        userCreated: this.props.auth.user.id
      };

      this.props.createOrder(newOrder, this.props.history, this.props.auth.user.occupation);
    }
  };

  render() {
    const { errors } = this.state;

    const disinfectors = this.props.order.disinfectors ? this.props.order.disinfectors : [];
    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: 0 }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push({
      label: worker.name, value: worker._id
    }));

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
      <div className="container create-order mt-4" >
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h1 className="display-4 text-center">Создать Заказ</h1>
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
                  {this.state.hasSecondPhone ? (
                    <React.Fragment>
                      <TextFieldGroup
                        label="Запасной Номер Телефона"
                        placeholder="Введите запасной номер телефона"
                        type="phone"
                        name="phone2"
                        value={this.state.phone2}
                        onChange={this.onChange}
                      />
                      <button className="btn btn-danger mb-2" onClick={this.deleteSecondPhone}>Убрать запасной номер телефона</button>
                    </React.Fragment>
                  ) : (
                      <button className="btn btn-success mb-3" onClick={this.toggleSecondPhone}>Добавить другой номер</button>
                    )}
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
                      <SelectListGroup
                        name="disinfectorId"
                        value={this.state.disinfectorId}
                        onChange={this.onChange}
                        error={errors.disinfectorId}
                        options={disinfectorOptions}
                      />
                    )}
                  <TextAreaFieldGroup
                    name="comment"
                    placeholder="Комментарии (Это поле не обязательное)"
                    value={this.state.comment}
                    onChange={this.onChange}
                    error={errors.comment}
                  />
                  <button type="submit" className="btn btn-success" >Создать</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateOrder.propTypes = {
  getDisinfectors: PropTypes.func.isRequired,
  createOrder: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getDisinfectors, createOrder })(withRouter(CreateOrder));