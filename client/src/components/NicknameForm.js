import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NicknameForm.css';

export default class NicknameForm extends Component {
  static propTypes = {
    setNicknameCallback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.nicknameInput = undefined;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.props.setNicknameCallback(this.nicknameInput.value);
    event.preventDefault();
  }

  render() {
    return (
      <form id="nickname-input" onSubmit={this.handleSubmit}>
        <label htmlFor="nickname-input-text">Name:
          <input
            id="nickname-input-text"
            type="text"
            ref={(ref) => { this.nicknameInput = ref; }}
            placeholder="Enter a nickname"
          />
        </label>
        <input id="nickname-input-submit" type="submit" value="Join chat" />
      </form>
    );
  }
}

