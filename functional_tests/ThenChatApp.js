/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';

export default class ThenChatApp extends Stage {
  @State chrome;
  @State chromes;
  @State nickname;
  @State message;
  @State messages;

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

  the_chat_room_is_visible() {
    this.expectElementExists('#chat-message-list');
    return this;
  }

  the_chat_message_is_displayed_in_the_chat_room() {
    const expectedMessage = ThenChatApp.buildExpectedMessage(this.nickname, this.message);
    this.expectElementHasText('.message', expectedMessage);
    return this;
  }

  user_$_can_see_the_chat_message_of_user_$(receiver, sender) {
    this.setChromeForUser(receiver);
    const expectedMessage = ThenChatApp.buildExpectedMessage(sender, this.messages.get(sender));
    this.expectElementHasText(`[id^=${sender}]`, expectedMessage);
    return this;
  }

  static buildExpectedMessage(nickname, message) {
    return `${nickname}:${message}`;
  }
}
