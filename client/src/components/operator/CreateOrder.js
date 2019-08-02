import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDisinfectors, createOrder } from '../../actions/orderActions';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

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
      timeTo: '',
      phone: '',
      typeOfService: '',
      comment: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getDisinfectors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    const date = this.state.date.split('-');
    const dateStringFrom = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeFrom}`);
    const dateStringTo = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeTo}`);

    const newOrder = {
      disinfectorId: this.state.disinfectorId,
      client: this.state.client,
      address: this.state.address,
      date: this.state.date,
      dateFrom: dateStringFrom,
      dateTo: dateStringTo,
      timeFrom: this.state.timeFrom,
      timeTo: this.state.timeTo,
      phone: this.state.phone,
      typeOfService: this.state.typeOfService,
      comment: this.state.comment
    };

    this.props.createOrder(newOrder, this.props.history, this.props.auth.user.occupation);
  };

  render() {
    const { errors } = this.state;

    const disinfectors = this.props.order.disinfectors.data ? this.props.order.disinfectors.data : [];
    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: 0 }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push({
      label: worker.name, value: worker._id
    }));

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
                    label="Время (часы:минуты:AM/PM) ПО"
                    name="timeTo"
                    type="time"
                    value={this.state.timeTo}
                    onChange={this.onChange}
                    error={errors.timeTo}
                  />
                  <TextFieldGroup
                    label="Телефон"
                    type="phone"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                  <TextFieldGroup
                    label="Тип Услуги"
                    type="text"
                    name="typeOfService"
                    value={this.state.typeOfService}
                    onChange={this.onChange}
                    error={errors.typeOfService}
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

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getDisinfectors, createOrder })(withRouter(CreateOrder));