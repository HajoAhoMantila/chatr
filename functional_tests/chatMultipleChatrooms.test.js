/* eslint-disable camelcase */
import { scenario, scenarios, setupForRspec } from 'js-given';
import WhenChatApp from './WhenChatApp';
import ThenChatApp from './ThenChatApp';
import { closeChromesAfterScenario, GivenUser } from './GivenUser';

setupForRspec(describe, it);

scenarios(
  'A user can join a new chat room',
  [GivenUser, WhenChatApp, ThenChatApp],
  ({ given, when, then }) => ({

    the_user_can_join_a_new_chat_room: scenario({}, () => {
      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app()
        .and()
        .the_user_enters_a_nickname()
        .and()
        .the_user_enters_the_new_chat_room_name('Munich');

      then().the_chat_room_$_is_visible('Munich')
        .and().the_chat_room_$_is_selected_in_the_list_of_chatrooms('Munich')
        .and()
        .a_system_message_is_shown_announcing_the_user_joined_the_room();
    }),


  }),
);

afterEach(() => {
  closeChromesAfterScenario();
});
