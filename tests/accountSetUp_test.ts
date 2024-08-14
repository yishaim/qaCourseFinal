import {fillSetUpFields, loginSetUpLocators, validateInvalidSetup} from "../pom/preLoginPages_pom";
import {
    deleteUserAPI,
    errorMessages,
    EUrls,
    loginApiRequest,
    users,
    validateUrl,
    validateUserExistsAPI
} from "../pom/general_pom";
import assert from "node:assert";

const { I } = inject();
const testUser = users.yishaiMarkovitz;

Feature('Account set up via UI');
Scenario('Pretest set up', async()=> {
    //ensure test users dont exist
    const user1Status = await loginApiRequest(testUser.email, testUser.password);
    const user2Status = await loginApiRequest(testUser.email, users.invalidUser.password);
    const user3Status = await loginApiRequest(users.invalidUser.email, testUser.password);
    if (user1Status.success !== false) {
        const deleteUser1Status = await deleteUserAPI(user1Status.data.token);
        console.log(deleteUser1Status);
    }
    if (user2Status.success !== false) {
        await deleteUserAPI(user2Status.data.token);
    }
    if (user3Status.success !== false) {
        await deleteUserAPI(user3Status.data.token);
    }
});
Scenario('Navigate to account set up test',  async() => {
    I.amOnPage(EUrls.loginPage);
    I.click(loginSetUpLocators.signUpButton);
    await validateUrl(EUrls.setup);
});
Scenario('Cancel account set up' , async() => {
    I.amOnPage(EUrls.setup);
    fillSetUpFields(testUser);
    I.click(loginSetUpLocators.cancelButton);
    await validateUrl(EUrls.loginPage);
    await validateUserExistsAPI(testUser.email, testUser.password, false);
});
Scenario('Test invalid email' , async() => {
    I.amOnPage(EUrls.setup);
    await validateInvalidSetup(testUser, loginSetUpLocators.emailInput);
});
Scenario('Test invalid password' , async() => {
    I.amOnPage(EUrls.setup);
    await validateInvalidSetup(testUser, loginSetUpLocators.passwordInput);
});

Scenario('Test valid account setup' , async() => {
    I.amOnPage(EUrls.setup);
    fillSetUpFields(testUser);
    I.click(loginSetUpLocators.submitButton);
    await validateUserExistsAPI(testUser.email, testUser.password, true);
});

Scenario('Test duplicate user creation', async() => {
    I.amOnPage(EUrls.setup);
    fillSetUpFields(testUser);
    I.click(loginSetUpLocators.submitButton);
    const errMsg = await I.grabTextFrom(loginSetUpLocators.setUpErrorMessage);
    assert.strictEqual(errMsg, errorMessages.setupDuplicateUser, `Expected error message: ${errorMessages.setupDuplicateUser}\nActual error message: ${errMsg}`);
})