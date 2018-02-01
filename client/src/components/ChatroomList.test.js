import { List } from 'immutable';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure, shallow, mount } from 'enzyme';
import React from 'react';
import ChatroomList from './ChatroomList';

configure({ adapter: new Adapter() });

describe('<ChatroomList />', () => {
  it('Should render the chat room list', () => {
    const createAndJoinRoomCallback = jest.fn();
    const wrapper = shallow(<ChatroomList
      currentRoom="Kitchen"
      roomNames={new List(['LivingRoom', 'Kitchen', 'Bathroom'])}
      createRoomCallback={createAndJoinRoomCallback}
    />);

    expect(wrapper.find('.roomname-selected')).toHaveLength(1);
    expect(wrapper.find('.roomname-selected').text()).toEqual('Kitchen');
    expect(wrapper.find('.roomname')).toHaveLength(2);
    expect(wrapper.find('.roomname').at(0).text()).toEqual('LivingRoom');
    expect(wrapper.find('.roomname').at(1).text()).toEqual('Bathroom');
  });

  it('Should call callback when new chat room name is submitted', () => {
    const createAndJoinRoomCallback = jest.fn();
    const wrapper = mount(<ChatroomList
      currentRoom="LivingRoom"
      roomNames={new List(['LivingRoom', 'Kitchen', 'Bathroom'])}
      createRoomCallback={createAndJoinRoomCallback}
    />);

    const newRoomName = 'ShinyNewRoom';
    wrapper.find('#newchatroom-input-text').instance().value = newRoomName;
    wrapper.find('#newchatroom-input-text').simulate('submit');

    expect(createAndJoinRoomCallback).toBeCalledWith(newRoomName);
  });
});
