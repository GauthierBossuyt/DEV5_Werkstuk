const { Validation } = require("../source/validation");
const VALIDATION = new Validation();

test("helper function to validate the username.", () => {
    expect(VALIDATION.checkUsername(120)).toBeFalsy();
    expect(VALIDATION.checkUsername("abcd")).toBeFalsy();
    expect(VALIDATION.checkUsername("g@uthier")).toBeFalsy();
    expect(VALIDATION.checkUsername({ name: "gauthier" })).toBeFalsy();
    expect(typeof VALIDATION.checkUsername("Gauthier")).toBeTruthy();
    expect(VALIDATION.checkUsername("Bossy")).toBeTruthy();
});

test("helper function to validate the email.", () => {
    expect(VALIDATION.checkEmail("ab")).toBeFalsy();
    expect(
        VALIDATION.checkEmail({
            email: "gauthier.bossuyt@student.ehb.be",
        })
    ).toBeFalsy();
    expect(
        VALIDATION.checkEmail("gauthier.bossuyt@student.ehb.be")
    ).toBeTruthy();
});

test("helper function to validate the password.", () => {
    expect(VALIDATION.checkPassword(123)).toBeFalsy();
    expect(VALIDATION.checkPassword("abc")).toBeFalsy();
    expect(VALIDATION.checkPassword("gauthierbossuyt")).toBeFalsy();
    expect(VALIDATION.checkPassword("gauthierBossuyt")).toBeFalsy();
    expect(VALIDATION.checkPassword("@gauthierBossuyt")).toBeFalsy();
    expect(VALIDATION.checkPassword("gauthierBossuyt9")).toBeFalsy();
    expect(
        VALIDATION.checkPassword({ password: "@gauthierBossuyt9" })
    ).toBeFalsy();
    expect(VALIDATION.checkPassword("@gauthierBossuyt9")).toBeTruthy();
});
