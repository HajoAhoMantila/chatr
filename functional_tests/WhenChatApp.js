/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';
import { generate } from 'randomstring';

const hostname = process.env.CHATR_URL || 'http://localhost:3000';

export default class WhenChooseNickname extends Stage {
    @State chrome;
    @State nickname;
    @State message;

    the_user_opens_the_app() {
      doAsync(async () => {
        await this.chrome.goto(hostname);
      });
      return this;
    }

    the_user_enters_a_nickname() {
      this.nickname = generate(8);
      doAsync(async () => {
        await this.chrome.type('#nickname-input-text', this.nickname);
        await this.chrome.click('#nickname-input-submit');
      });
      return this;
    }

    the_user_sends_a_chat_message() {
      this.message = generate(32);
      doAsync(async () => {
        await this.chrome.type('#message-input-text', this.message);
        await this.chrome.type('#message-input-text', '\r');
      });
    }
}
