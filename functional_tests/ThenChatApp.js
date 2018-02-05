/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';

export default class ThenChatApp extends Stage {
  @State chrome;
  @State chromes;
  @State nickname;
  @State messages;
  @State room;

  setChromeForUser(nickname) {
    expect(this.chromes.has(nickname)).toBeTruthy();
    this.chrome = this.chromes.get(nickname);
  }

  expectElementExists(selector) {
    doAsync(async () => {
      const exists = await this.chrome.exists(selector);
      expect(exists).toBeTruthy();
    });
  }

  expectElementDoesNotExist(selector) {
    doAsync(async () => {
      const exists = await this.chrome.exists(selector, 500);
      expect(exists).toBeFalsy();
    });
  }

  expectElementHasText(selector, expectedText) {
    doAsync(async () => {
      const text = await this.chrome.text(selector);
      expect(text).toBe(expectedText);
    });
  }

  expectElementContainsText(selector, expectedText) {
    doAsync(async () => {
      const text = await this.chrome.text(selector);
      expect(text).toContain(expectedText);
    });
  }

  expectElementDoesNotContainText(selector, expectedText) {
    doAsync(async () => {
      const text = await this.chrome.text(selector);
      expect(text).not.toContain(expectedText);
    });
  }

  the_user_can_see_an_input_field_for_a_nickname() {
    this.expectElementExists('#nickname-input');
    return this;
  }

  the_nickname_is_displayed() {
    this.expectElementHasText('#nickname', this.nickname);
    return this;
  }

  the_chat_room_is_not_visible() {
    this.expectElementDoesNotExist('#chat-message-list');
    return this;
  }

  the_chat_room_$_is_visible(room) {
    return this.the_chat_room_$_is_visible_for_user(room, this.nickname);
  }

  the_chat_room_$_is_visible_for_user(room, nickname) {
    this.setChromeForUser(nickname);
    this.expectElementExists('#chat-message-list');
    this.expectElementContainsText('#chatroom-name', room);
    return this;
  }

  the_chat_room_$_is_listed_and_not_selected(chatroomName) {
    this.expectElementContainsText(`#room-${chatroomName}`, chatroomName);
    this.expectElementDoesNotContainText('.roomname-selected', chatroomName);
    return this;
  }

  the_chat_room_$_is_listed_and_not_selected_for_user(chatroomName, nickname) {
    this.setChromeForUser(nickname);
    this.the_chat_room_$_is_listed_and_not_selected(chatroomName);
    return this;
  }

  the_chat_room_$_is_listed_and_selected(chatroomName) {
    this.expectElementContainsText('.roomname-selected', chatroomName);
    return this;
  }

  the_user_can_see_the_message_in_the_chat_room() {
    this.user_$_can_see_the_chat_message_of_user_$(this.nickname, this.nickname);
    return this;
  }

  the_user_can_see_the_message(message) {
    this.expectElementHasText('.message', ThenChatApp.buildExpectedMessage(this.nickname, message));
    return this;
  }

  user_$_can_see_the_chat_message_of_user_$(receiver, sender) {
    this.setChromeForUser(receiver);
    const expectedMessage = ThenChatApp.buildExpectedMessage(sender, this.messages.get(sender));
    this.expectElementHasText(`[id^=${sender}]`, expectedMessage);
    return this;
  }

  a_system_message_is_shown_announcing_the_user_joined_the_room() {
    const expectedMessage = ThenChatApp.buildExpectedMessage('System', `${this.nickname} joined room ${this.room}`);
    this.expectElementHasText(`[id^=${'System'}]`, expectedMessage);
    return this;
  }

  static buildExpectedMessage(nickname, message) {
    return `${nickname}:${message}`;
  }
}
