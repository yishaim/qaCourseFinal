import {fillSetUpFields, loginSetUpLocators, validateInvalidSetup} from "../pom/preLoginPages_pom";
import {
    deleteUserAPI,
    EUrls, EWaitTimes,
    loginApiRequest,
    users,
    validateUrl,
    validateUserExistsAPI
} from "../pom/general_pom";

const { I } = inject();
const testUser = users.yishaiMarkovitz;

Feature('Account set up via UI');
Scenario('Pretest set up', async()=> {
    //ensure test users dont exist
    const user1Status = await loginApiRequest(testUser.email, testUser.password);
    const user2Status = await loginApiRequest(testUser.email, users.invalidUser.password);
    const user3Status = await loginApiRequest(users.invalidUser.email, testUser.password);
    if (user1Status.success && user1Status.data && user1Status.data.token) {
        await deleteUserAPI(user1Status.data.token);
        await validateUserExistsAPI(testUser.email, testUser.password, false);
    }
    if (user2Status.success && user2Status.data && user2Status.data.token) {
        await deleteUserAPI(user2Status.data.token);
        await validateUserExistsAPI(testUser.email, testUser.password, false);
    }
    if (user3Status.success && user3Status.data && user3Status.data.token) {
        await deleteUserAPI(user3Status.data.token);
        await validateUserExistsAPI(testUser.email, testUser.password, false);
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
    await validateInvalidSetup(testUser, loginSetUpLocators.emailInput, false);
});
Scenario('Test invalid password' , async() => {
    I.amOnPage(EUrls.setup);
    await validateInvalidSetup(testUser, loginSetUpLocators.passwordInput, false);
});
Scenario('Test valid account setup' , async() => {
    I.amOnPage(EUrls.setup);
    fillSetUpFields(testUser);
    await I.click(loginSetUpLocators.submitButton);
    await validateUserExistsAPI(testUser.email, testUser.password, true);
    await validateUrl(EUrls.contactList);
});
Scenario('Test duplicate user creation', async() => {
    I.amOnPage(EUrls.setup);
    await validateInvalidSetup(testUser, "duplicate", true);
})

Scenario('Test valid login', async() => {
    I.amOnPage(EUrls.loginPage);
    I.fillField(loginSetUpLocators.emailInput,testUser.email);
    I.fillField(loginSetUpLocators.passwordInput,testUser.password);
    I.click(loginSetUpLocators.loginButton);
    I.wait(EWaitTimes.SHORT);
    await validateUrl(EUrls.contactList);
})