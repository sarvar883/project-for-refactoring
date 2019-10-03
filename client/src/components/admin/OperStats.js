import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import moment from 'moment';

import ShowOperStats from './ShowOperStats';

import { getAllOperators, getOperatorStats } from '../../actions/adminActions';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';



function getWeekDays(weekStart) {
  const days = [];
  for (let i = 1; i < 8; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date)
      .startOf('week')
      .toDate(),
    to: moment(date)
      .endOf('week')
      .toDate(),
  };
}



class OperStats extends Component {
  state = {
    month: '',
    year: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',

    hoverRange: undefined,
    selectedDays: [],
    selectedDaysAfterSubmit: [],

    operatorId: '',
    // operatorIdMonth: '',
    // operatorIdWeek: '',
    operatorName: ''
  };

  componentDidMount() {
    this.props.getAllOperators();
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    this.props.admin.operators.forEach(person => {
      if (person._id.toString() === this.state.operatorId.toString()) {
        this.setState({
          headingMonth: this.state.month,
          headingYear: this.state.year,
          operatorName: person.name
        });
      }
    });
    const object = {
      type: 'month',
      operatorId: this.state.operatorId,
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getOperatorStats(object);
  }

  getWeekStats = (e) => {
    e.preventDefault();
    if (this.state.selectedDays.length === 0) {
      alert('Вы не выбрали неделю');
    } else {
      this.props.admin.operators.forEach(person => {
        if (person._id.toString() === this.state.operatorId.toString()) {
          this.setState({
            selectedDaysAfterSubmit: this.state.selectedDays,
            operatorName: person.name
          });
        }
      });
      const object = {
        type: 'week',
        operatorId: this.state.operatorId,
        days: this.state.selectedDays
      };
      this.props.getOperatorStats(object);
    }
  }




  // weekly calendar
  handleDayChange = date => {
    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from)
    });
  };

  handleDayEnter = date => {
    this.setState({
      hoverRange: getWeekRange(date)
    });
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined
    });
  };

  handleWeekClick = (weekNumber, days, e) => {
    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
    });
  };
  // end of weekly calendar



  render() {
    const date = new Date();

    const monthsNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const months = [
      { label: "-- Выберите месяц -- ", value: "" }
    ];
    monthsNames.forEach((month, i) => {
      months.push({
        label: month, value: i
      });
    });

    let years = [
      { label: "-- Выберите Год -- ", value: "" }
    ];
    for (let i = 2019; i <= date.getFullYear(); i++) {
      years.push({
        label: i, value: i
      });
    }

    const yearsOptions = years.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = months.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );

    let operatorOptions = [{
      label: "-- Выберите Оператора -- ", value: ""
    }];

    this.props.admin.operators.forEach(person => {
      operatorOptions.push({
        label: person.name, value: person._id
      });
    });

    let renderOperatorOptions = operatorOptions.map((item, index) =>
      <option value={item.value} key={index}>{item.label}</option>
    );



    // weekly calender
    const { hoverRange, selectedDays } = this.state;

    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6]
    };
    // end of calendar



    return (
      <div className="container-fluid" >
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <h4 className="text-center">Статистика по месяцам</h4>
            <form onSubmit={this.getMonthStats}>
              <div className="form-group">
                <label htmlFor="operatorId"><strong>Выберите Оператора:</strong></label>
                <select name="operatorId" className="form-control" onChange={this.onChange} required>
                  {renderOperatorOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="year"><strong>Выберите Год:</strong></label>
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="month"><strong>Выберите Месяц:</strong></label>
                <select name="month" className="form-control" onChange={this.onChange} required>
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 ml-auto weekly-stats">
            <div className="SelectedWeekExample">
              <h4 className="text-center">Статистика по неделям</h4>
              <DayPicker
                selectedDays={selectedDays}
                showWeekNumbers
                showOutsideDays
                modifiers={modifiers}
                firstDayOfWeek={1}
                onDayClick={this.handleDayChange}
                onDayMouseEnter={this.handleDayEnter}
                onDayMouseLeave={this.handleDayLeave}
                onWeekClick={this.handleWeekClick}
              />
            </div>
            <form onSubmit={this.getWeekStats}>
              <div className="form-group">
                <label htmlFor="operatorId"><strong>Выберите Оператора:</strong></label>
                <select name="operatorId" className="form-control" onChange={this.onChange} required>
                  {renderOperatorOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            {this.props.admin.method === 'week' && this.state.operatorName && this.state.selectedDays ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика Оператора {this.state.operatorName} за <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[6]}</Moment></h2> : ''
            }

            {this.props.admin.method === 'month' && this.state.operatorName && this.state.headingMonth && this.state.headingYear ?
              <h2 className="text-center pl-3 pr-3">Месячная Статистика Оператора {this.state.operatorName} за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowOperStats />}
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

export default connect(mapStateToProps, { getAllOperators, getOperatorStats })(withRouter(OperStats));