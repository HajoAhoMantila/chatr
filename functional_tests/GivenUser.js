/* eslint-disable camelcase */
import { Stage, State } from 'js-given';
import { Chrome } from 'navalia/build/index';

let createdChromes = [];

class GivenUser extends Stage {
  @State chrome;

  a_user_with_a_Chrome_browser() {
    this.chrome = new Chrome();
    createdChromes.push(this.chrome);
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
