import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure, shallow } from 'enzyme';
import React from 'react';
import ChatrApp from './ChatrApp';
import SocketIoClient from './chat/SocketIoClient';

configure({ adapter: new Adapter() });

jest.mock('./chat/SocketIoClient');

describe('<ChatrApp />', () => {
  it('Should display nickname dialog and no chatroom when no nickname is set', () => {
    const wrapper = shallow(<ChatrApp remoteClient={new SocketIoClient()} />);

    wrapper.instance().chat.setNickname(null);
    wrapper.update();

    expect(wrapper.find('NicknameForm').exists()).toBeTruthy();
    expect(wrapper.find('Chatroom').exists()).toBeFalsy();
  });
  it('Should not display nickname dialog but chatroom when nickname is set', () => {
    const wrapper = shallow(<ChatrApp remoteClient={new SocketIoClient()} />);

    wrapper.instance().chat.setNickname('foo');
    wrapper.update();

    expect(wrapper.find('NicknameForm').exists()).toBeFalsy();
    expect(wrapper.find('Chatroom').exists()).toBeTruthy();
  });
});
