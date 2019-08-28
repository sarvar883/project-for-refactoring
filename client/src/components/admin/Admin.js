import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addAnons } from '../../actions/chatActions';

class Admin extends Component {
  state = {
    anons: ''
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  createAd = (e) => {
    e.preventDefault();
    const object = {
      adminId: this.props.auth.user.id,
      body: this.state.anons
    };
    this.props.addAnons(object, this.props.history);
    this.setState({ anons: '' });
  };

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <h2 className="m-auto">Страница Админа {this.props.auth.user.name}</h2>
        </div>

        <div className="row">
          <div className="ads">
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createAnons">
              Создать Объявление
          </button>
            <div className="modal fade" id="createAnons">
              <div className="modal-dialog">
                <div className="modal-content">

                  <div className="modal-header">
                    <h4 className="modal-title">Создать Объявление</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>

                  <form onSubmit={this.createAd}>
                    <div className="modal-body">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows="5"
                          name="anons"
                          defaultValue={this.state.anons}
                          placeholder="Пишите Ваше Объяление ..."
                          required
                          onChange={this.onChange}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">Создать</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <Link to="/admin/materials" className="btn btn-success">Материалы</Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { addAnons })(withRouter(Admin));