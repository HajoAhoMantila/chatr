/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';
import { generate } from 'randomstring';

const hostname = process.env.CHATR_URL || 'http://localhost:3000';

export default class WhenChatApp extends Stage {
  @State chrome;
  @State chromes;
  @State nickname;
  @State message;
  @State messages = new Map();

  setChromeForUser(nickname) {
    expect(this.chromes.has(nickname)).toBeTruthy();
    this.chrome = this.chromes.get(nickname);
  }

  the_user_opens_the_app() {
    doAsync(async () => {
      await this.chrome.goto(hostname);
    });
    return this;
  }

  the_user_$_opens_the_app(nickname) {
    this.setChromeForUser(nickname);
    doAsync(async () => {
      await this.chrome.goto(hostname);
    });
    return this;
  }

  the_user_enters_the_nickname(nickname) {
    doAsync(async () => {
      await this.chrome.type('#nickname-input-text', nickname);
      await this.chrome.click('#nickname-input-submit');
    });
    return this;
  }

  the_user_enters_a_nickname() {
    this.nickname = generate(8);
    return this.the_user_enters_the_nickname(this.nickname);
  }

  the_user_$_sends_a_chat_message(nickname) {
    this.setChromeForUser(nickname);
    this.message = nickname + generate(32);
    doAsync(async () => {
      await this.chrome.type('#message-input-text', this.message);
      await this.chrome.type('#message-input-text', '\r');
    });
    this.messages.set(nickname, this.message);
    return this;
  }

  the_user_sends_a_chat_message() {
    this.message = generate(32);
    doAsync(async () => {
      await this.chrome.type('#message-input-text', this.message);
      await this.chrome.type('#message-input-text', '\r');
    });
    return this;
  }
}
