import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import NicknameForm from './NicknameForm';

configure({ adapter: new Adapter() });

test('Calls callback when nickname is submitted', () => {
  const setNickname = jest.fn();
  const nicknameForm = mount(<NicknameForm setNicknameCallback={setNickname} />);

  nicknameForm.find('#nickname-input-text').instance().value = 'username';
  nicknameForm.find('#nickname-input').simulate('submit');

  expect(setNickname).toBeCalledWith('username');
});

test('Does not call callback when empty nickname is submitted', () => {
  const setNickname = jest.fn();
  const nicknameForm = mount(<NicknameForm setNicknameCallback={setNickname} />);

  nicknameForm.find('#nickname-input-text').instance().value = '';
  nicknameForm.find('#nickname-input').simulate('submit');

  expect(setNickname).not.toBeCalled();
});
