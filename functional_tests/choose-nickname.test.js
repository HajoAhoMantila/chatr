import {scenario, scenarios, setupForRspec, Stage} from "js-given";

setupForRspec(describe, it);

class GivenUser extends Stage {
    a_user_with_a_Chrome_browser() {
        return this;
    }
}

class WhenChooseNickname extends Stage {
    the_user_opens_the_app() {
        return this;
    }
}

class ThenChooseNickname extends Stage {
    the_user_can_see_an_input_field_for_a_nickname() {
        fail();
        return this;
    }
}

scenarios(
    "A user can choose a nickname",
    [GivenUser, WhenChooseNickname, ThenChooseNickname],
    ({given, when, then}) => {
        return {
            the_user_is_asked_for_a_nickname: scenario({}, () => {
                given().a_user_with_a_Chrome_browser();

                when().the_user_opens_the_app();

                then().the_user_can_see_an_input_field_for_a_nickname();
            })
        };
    }
);
