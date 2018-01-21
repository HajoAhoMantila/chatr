import React from 'react';
import NicknameForm from "./NicknameForm";

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {spy} from "sinon";

configure({adapter: new Adapter()});

test('Calls callback when nickname is submitted', () => {
    const setNickname = spy();
    const nicknameForm = mount(<NicknameForm setNicknameCallback={setNickname}/>);

    nicknameForm.find("#nickname-input-text").simulate('change', {target: {value: 'username'}});
    nicknameForm.find("#nickname-input").simulate('submit');

    expect(setNickname.calledWith('username')).toBeTruthy();
});