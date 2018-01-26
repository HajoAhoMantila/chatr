/* eslint-disable camelcase */
import { scenario, scenarios, setupForRspec } from 'js-given';
import WhenChatApp from './WhenChatApp';
import ThenChatApp from './ThenChatApp';
import { closeChromesAfterScenario, GivenUser } from './GivenUser';

setupForRspec(describe, it);


scenarios(
  'A user can choose a nickname',
  [GivenUser, WhenChatApp, ThenChatApp],
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
  closeChromesAfterScenario();
});
