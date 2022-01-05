import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { addClient } from '../../actions/adminActions';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import validatePhoneNumber from '../../utils/validatePhone';


class AddClient extends Component {
  state = {
    type: '',
    name: '',
    phone: '',
    address: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.state.type) {
      return alert('Выберите тип клиента');
    }

    let object = {};

    if (this.state.type === 'individual') {
      // validate phone number
      const phoneValidityObject = validatePhoneNumber(this.state.phone);

      // phone
      if (!phoneValidityObject.isValid) {
        return alert(phoneValidityObject.message);
      }

      object = {
        type: this.state.type,
        name: this.state.name,
        phone: this.state.phone,
        address: this.state.address,
        createdAt: new Date()
      };
    }

    if (this.state.type === 'corporate') {
      object = {
        type: this.state.type,
        name: this.state.name,
        createdAt: new Date()
      };
    }

    this.props.addClient(object, this.props.history, this.props.auth.user.occupation);
  }

  render() {
    const { errors } = this.state;

    const clientTypes = [
      { label: '-- Введите тип клиента --', value: '' },
      { label: 'Корпоративный', value: 'corporate' },
      { label: 'Физический', value: 'individual' }
    ];

    return (
      <div className="container create-order mt-4" >
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h1 className="display-4 text-center">Добавить Клиента</h1>
                <form onSubmit={this.onSubmit}>
                  <SelectListGroup
                    name="type"
                    value={this.state.type}
                    onChange={this.onChange}
                    error={errors.type}
                    options={clientTypes}
                    required
                  />
                  <TextFieldGroup
                    label="Введите Имя Клиента"
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                    required
                  />
                  {this.state.type === 'individual' ? (
                    <React.Fragment>
                      <TextFieldGroup
                        label="Введите Тел Номер Клиента в формате +998XX-XXX-XX-XX (без тире)"
                        type="text"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                        error={errors.phone}
                        required
                      />
                      <TextFieldGroup
                        label="Введите Адрес Клиента"
                        type="text"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        error={errors.address}
                        required
                      />
                    </React.Fragment>
                  ) : ''}
                  <button type="submit" className="btn btn-success">Добавить</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { addClient })(withRouter(AddClient));