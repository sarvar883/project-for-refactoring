const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateOrderInput(data) {
  let errors = {};

  data.disinfectorId = !isEmpty(data.disinfectorId) ? data.disinfectorId : '';
  data.client = !isEmpty(data.client) ? data.client : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.date = !isEmpty(data.date) ? data.date : '';
  data.time = !isEmpty(data.time) ? data.time : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.typeOfService = !isEmpty(data.typeOfService) ? data.typeOfService : '';

  if (Validator.isEmpty(data.disinfectorId)) {
    errors.disinfectorId = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.client)) {
    errors.client = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Это поле обязательное';
  }
  if (Validator.isEmpty(data.date)) {
    errors.date = 'Это поле обязательное';
  }

  if (Validator.isEmpty(data.time)) {
    errors.time = 'Это поле обязательное';
  }
  if (Validator.isEmpty(data.typeOfService)) {
    errors.typeOfService = 'Это поле обязательное';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};