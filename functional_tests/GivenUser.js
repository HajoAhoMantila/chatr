/* eslint-disable camelcase */
import { Stage, State } from 'js-given';
import { Chrome } from 'navalia';

let createdChromes = [];

class GivenUser extends Stage {
  @State chrome;
  @State chromes = new Map();

  createNewChromeAndSetAsCurrent() {
    const chromeTimeout = (process.env.NAVALIA_TIMEOUT || 1000);
    this.chrome = new Chrome({ timeout: chromeTimeout });
    createdChromes.push(this.chrome);
    return this.chrome;
  }

  a_user_with_nickname_$_and_a_Chrome_Browser(nickname) {
    this.createNewChromeAndSetAsCurrent();
    this.chromes.set(nickname, this.chrome);
    return this;
  }

  a_user_with_a_Chrome_browser() {
    this.createNewChromeAndSetAsCurrent();
    return this;
  }
}

function closeChromesAfterScenario() {
  createdChromes.forEach((chrome) => {
    chrome.done();
  });
  createdChromes = [];
}

export { GivenUser, closeChromesAfterScenario };
