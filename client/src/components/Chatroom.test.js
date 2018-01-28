import { List } from 'immutable';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure, shallow, mount } from 'enzyme';
import React from 'react';
import Chatroom from './Chatroom';

configure({ adapter: new Adapter() });

describe('<Chatroom />', () => {
  it('Should render the chat log', () => {
    const wrapper = shallow(<Chatroom
      sendMessageCallback={jest.fn()}
      messages={new List([
        { nickname: 'Alice', message: 'Foo' },
        { nickname: 'Bob', message: 'Bar' },
      ])}
    />);

    expect(wrapper.find('li')).toHaveLength(2);
    expect(wrapper.find('li').at(0).text()).toBe('Alice: Foo');
    expect(wrapper.find('li').at(1).text()).toBe('Bob: Bar');
  });
  it('Should call callback when new message is submitted', () => {
    const sendMessageCallback = jest.fn();
    const wrapper = mount(<Chatroom
      sendMessageCallback={sendMessageCallback}
      messages={new List()}
    />);

    wrapper.find('#message-input-text').simulate('change', { target: { value: 'testmessage' } });
    wrapper.find('#message-input-text').simulate('submit');

    expect(sendMessageCallback).toBeCalledWith('testmessage');
  });
});
