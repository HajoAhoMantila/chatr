import {doAsync, scenario, scenarios, setupForRspec, Stage, State} from "js-given";
import {Chrome} from 'navalia';

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

    the_user_opens_the_app() {
        doAsync(async () => {
            await this.chrome.goto('http://localhost:3000');
        });
        return this;
    }
}

class ThenChooseNickname extends Stage {
    @State chrome;

    the_user_can_see_an_input_field_for_a_nickname() {
        doAsync(async () => {
            const exists = await this.chrome.exists("#nickname-input");
            expect(exists).toBeTruthy();
        });
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

afterEach(() => {
    createdChromes.forEach(function (chrome) {
        chrome.done()
    });
    createdChromes = [];
});
