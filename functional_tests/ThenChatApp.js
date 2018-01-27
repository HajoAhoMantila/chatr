/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';

export default class ThenChooseNickname extends Stage {
    @State chrome;
    @State nickname;
    @State message;

    expectElementExists(selector) {
      doAsync(async () => {
        const exists = await this.chrome.exists(selector);
        expect(exists).toBeTruthy();
      });
    }

    expectElementDoesNotExist(selector) {
      doAsync(async () => {
        const exists = await this.chrome.exists(selector);
        expect(exists).toBeFalsy();
      });
    }

    expectElementHasText(selector, expectedText) {
      doAsync(async () => {
        const text = await this.chrome.text(selector);
        expect(text).toBe(expectedText);
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
      this.expectElementHasText('li', this.message);
      return this;
    }
}