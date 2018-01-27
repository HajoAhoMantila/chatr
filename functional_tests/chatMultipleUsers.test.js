/* eslint-disable camelcase */
import { scenario, scenarios, setupForRspec } from 'js-given';
import WhenChatApp from './WhenChatApp';
import ThenChatApp from './ThenChatApp';
import { closeChromesAfterScenario, GivenUser } from './GivenUser';

setupForRspec(describe, it);

const userA = 'Alice';
const userB = 'Bob';

scenarios(
  'Users can exchange chat messages',
  [GivenUser, WhenChatApp, ThenChatApp],
  ({ given, when, then }) => ({
    users_can_see_messages_of_other_users: scenario({}, () => {
      given().a_user_with_nickname_$_and_a_Chrome_Browser(userA)
        .and().a_user_with_nickname_$_and_a_Chrome_Browser(userB);

      when().the_user_$_opens_the_app(userA)
        .and()
        .the_user_enters_the_nickname(userA)
        .and()
        .the_user_$_opens_the_app(userB)
        .and()
        .the_user_enters_the_nickname(userB)
        .and()
        .the_user_$_sends_a_chat_message(userA);

      then().user_$_can_see_the_chat_message(userA);

      // not yet implemented
      // then().user_$_can_see_the_chat_message(userB);
    }),
  }),
);

afterEach(() => {
  closeChromesAfterScenario();
});
