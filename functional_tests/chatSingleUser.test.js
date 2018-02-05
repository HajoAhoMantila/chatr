/* eslint-disable camelcase */
import { scenario, scenarios, setupForRspec } from 'js-given';
import WhenChatApp from './WhenChatApp';
import ThenChatApp from './ThenChatApp';
import { closeChromesAfterScenario, GivenUser } from './GivenUser';

setupForRspec(describe, it);

scenarios(
  'A single user can send messages',
  [GivenUser, WhenChatApp, ThenChatApp],
  ({ given, when, then }) => ({

    after_choosing_a_nickname_the_Lobby_chat_room_is_shown: scenario({}, () => {
      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app();
      then().the_chat_room_is_not_visible();

      when().the_user_enters_a_nickname();
      then().the_chat_room_$_is_visible('Lobby')
        .and().the_chat_room_$_is_listed_and_selected('Lobby');
    }),

    the_user_can_write_a_chat_message: scenario({}, () => {
      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app()
        .and()
        .the_user_enters_a_nickname()
        .and()
        .the_user_sends_a_chat_message();

      then().the_user_can_see_the_message_in_the_chat_room();
    }),

  }),
);

afterEach(() => {
  closeChromesAfterScenario();
});
