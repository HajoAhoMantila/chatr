/* eslint-disable camelcase */
import { doAsync, Stage, State } from 'js-given';
import { generate } from 'randomstring';

const hostname = process.env.CHATR_URL || 'http://localhost:3000';

export default class WhenChatApp extends Stage {
  @State chrome;
  @State chromes;
  @State nickname;
  @State messages = new Map();
  @State room;

  setChromeForUser(nickname) {
    expect(this.chromes.has(nickname)).toBeTruthy();
    this.chrome = this.chromes.get(nickname);
  }

  the_user_opens_the_app() {
    return this.the_user_$_opens_the_app(this.nickname);
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
    return this.the_user_enters_the_nickname(this.nickname);
  }

  the_user_$_sends_a_chat_message(nickname) {
    this.setChromeForUser(nickname);
    const message = nickname + generate(32);
    doAsync(async () => {
      await this.chrome.type('#message-input-text', message);
      await this.chrome.type('#message-input-text', '\r');
    });
    this.messages.set(nickname, message);
    return this;
  }

  the_user_sends_a_chat_message() {
    const message = this.nickname + generate(32);
    return this.the_user_sends_the_chat_message(message);
  }

  the_user_sends_the_chat_message(message) {
    doAsync(async () => {
      await this.chrome.type('#message-input-text', message);
      await this.chrome.type('#message-input-text', '\r');
    });
    this.messages.set(this.nickname, message);
    return this;
  }

  the_user_joins_the_chat_room(room) {
    return this.user_$_joins_the_chat_room(this.nickname, room);
  }

  the_user_switches_to_chat_room(room) {
    doAsync(async () => {
      await this.chrome.click(`#room-${room}`);
    });
    return this;
  }

  user_$_joins_the_chat_room(nickname, room) {
    this.setChromeForUser(nickname);
    doAsync(async () => {
      await this.chrome.type('#newchatroom-input-text', room);
      await this.chrome.type('#newchatroom-input-text', '\r');
    });
    this.room = room;
    return this;
  }
}
