/* eslint-disable camelcase */
import { doAsync, scenario, scenarios, setupForRspec, Stage, State } from 'js-given';
import { Chrome } from 'navalia';

setupForRspec(describe, it);

let createdChromes = [];

class GivenUser extends Stage {
    @State chrome;

    a_user_with_a_Chrome_browser() {
      this.chrome = new Chrome();
      createdChromes.push(this.chrome);
      return this;
    }
}

class WhenChooseNickname extends Stage {
    @State chrome;
    @State nickname;

    the_user_opens_the_app() {
      doAsync(async () => {
        await this.chrome.goto('http://localhost:3000');
      });
      return this;
    }

    the_user_enters_a_nickname() {
      this.nickname = Math.random().toString(36).substring(10);
      doAsync(async () => {
        await this.chrome.type('#nickname-input-text', this.nickname);
        await this.chrome.click('#nickname-input-submit');
      });
      return this;
    }
}

class ThenChooseNickname extends Stage {
    @State chrome;
    @State nickname;

    the_user_can_see_an_input_field_for_a_nickname() {
      doAsync(async () => {
        const exists = await this.chrome.exists('#nickname-input');
        expect(exists).toBeTruthy();
      });
      return this;
    }

    the_nickname_is_displayed() {
      doAsync(async () => {
        const nickname_text = await this.chrome.text('#nickname');
        expect(nickname_text).toBe(this.nickname);
      });
      return this;
    }
}

scenarios(
  'A user can choose a nickname',
  [GivenUser, WhenChooseNickname, ThenChooseNickname],
  ({ given, when, then }) => ({
    the_user_is_asked_for_a_nickname: scenario({}, () => {
      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app();

      then().the_user_can_see_an_input_field_for_a_nickname();
    }),
    the_chosen_nickname_is_displayed: scenario({}, () => {
      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app()
        .and().the_user_enters_a_nickname();

      then().the_nickname_is_displayed();
    }),
  }),
);

afterEach(() => {
  createdChromes.forEach((chrome) => {
    chrome.done();
  });
  createdChromes = [];
});
