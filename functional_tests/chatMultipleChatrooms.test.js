/* eslint-disable camelcase */
import { scenario, scenarios, setupForRspec } from 'js-given';
import WhenChatApp from './WhenChatApp';
import ThenChatApp from './ThenChatApp';
import { closeChromesAfterScenario, GivenUser } from './GivenUser';

setupForRspec(describe, it);

const userA = 'Alice';
const userB = 'Bob';

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
        .the_user_joins_the_chat_room('Munich');

      then().the_chat_room_$_is_visible('Munich')
        .and()
        .the_chat_room_$_is_selected_in_the_list_of_chatrooms('Munich')
        .and()
        .the_chat_room_$_is_not_selected_in_the_list_of_chatrooms('Lobby')
        .and()
        .a_system_message_is_shown_announcing_the_user_joined_the_room();
    }),

    users_can_exchange_messages_in_a_new_chat_room: scenario({}, () => {
      const newRoomName = 'Munich';

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
        .user_$_joins_the_chat_room(userA, newRoomName)
        .and()
        .user_$_joins_the_chat_room(userB, newRoomName);

      then()
        .the_chat_room_$_is_visible_for_user(newRoomName, userA)
        .and()
        .the_chat_room_$_is_visible_for_user(newRoomName, userB);

      when().the_user_$_sends_a_chat_message(userA);
      then().user_$_can_see_the_chat_message_of_user_$(userA, userA);
      then().user_$_can_see_the_chat_message_of_user_$(userB, userA);

      when().the_user_$_sends_a_chat_message(userB);
      then().user_$_can_see_the_chat_message_of_user_$(userA, userB);
      then().user_$_can_see_the_chat_message_of_user_$(userB, userB);
    }),

    users_can_switch_between_chat_rooms_and_no_messages_are_lost: scenario({}, () => {
      const roomA = 'Firefly';
      const roomB = 'Serenity';
      const messageA = 'Shiny!';
      const messageB = 'I swallowed a bug.';

      given().a_user_with_a_Chrome_browser();

      when().the_user_opens_the_app()
        .and()
        .the_user_enters_a_nickname()
        .and()
        .the_user_joins_the_chat_room(roomA)
        .and()
        .the_user_sends_the_chat_message(messageA)
        .and()
        .the_user_joins_the_chat_room(roomB)
        .and()
        .the_user_sends_the_chat_message(messageB)
        .and()
        .the_user_switches_to_chat_room(roomA);

      then().the_user_can_see_the_message(messageA);

      when().the_user_switches_to_chat_room(roomB);

      then().the_user_can_see_the_message(messageB);
    }),
  }),
);

afterEach(() => {
  closeChromesAfterScenario();
});
