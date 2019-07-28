import React, { Component } from 'react';

class EditMessage extends Component {
  state = {
    id: '',
    body: this.props.editmessagebody
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    console.log('EditMessage');
  }

  render() {
    return (
      <div className="edit-message">
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="edit-message-input"
              name="body"
              placeholder="Type Message Here ..."
              defaultValue={this.state.body}
              required
              onChange={this.onChange}
            />
            <div className="input-group-append">
              <button type="submit" className="btn btn-warning">Edit</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default EditMessage;