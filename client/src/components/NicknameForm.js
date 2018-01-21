import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NicknameForm extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.setNicknameCallback(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form id="nickname-input" onSubmit={this.handleSubmit}>
        <label htmlFor="nickname-input-text">Name:
          <input id="nickname-input-text" type="text" onChange={this.handleChange} />
        </label>
        <input id="nickname-input-submit" type="submit" value="Submit" />
      </form>
    );
  }
}


NicknameForm.propTypes = {
  setNicknameCallback: PropTypes.func.isRequired,
};

export default NicknameForm;
