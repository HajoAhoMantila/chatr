import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure, shallow } from 'enzyme';
import React from 'react';
import ChatrApp from './ChatrApp';

configure({ adapter: new Adapter() });

jest.mock('./chat/SocketIoClient');

describe('<ChatrApp />', () => {
  it('Should display nickname dialog and no chatroom and no nickname when nickname is not set', () => {
    const wrapper = shallow(<ChatrApp />);

    wrapper.instance().chat.connectWithNickname(null);
    wrapper.update();

    expect(wrapper.find('NicknameForm').exists()).toBeTruthy();
    expect(wrapper.find('Chatroom').exists()).toBeFalsy();
    expect(wrapper.find('#nickname').text()).toEqual('');
  });

  it('Should not display nickname dialog but nickname and chatroom when nickname is set', () => {
    const nickname = 'foo';
    const wrapper = shallow(<ChatrApp />);

    wrapper.instance().chat.connectWithNickname(nickname);
    wrapper.update();

    expect(wrapper.find('NicknameForm').exists()).toBeFalsy();
    expect(wrapper.find('Chatroom').exists()).toBeTruthy();
    expect(wrapper.find('ChatroomList').exists()).toBeTruthy();
    expect(wrapper.find('#nickname').text()).toEqual(nickname);
  });
});
