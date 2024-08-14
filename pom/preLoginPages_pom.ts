import {errorMessages, EWaitTimes, users, validateUserExistsAPI} from "./general_pom";
import assert from "node:assert";
const { I } = inject();

export const loginSetUpLocators = {
    emailInput: "[id='email']",
    passwordInput: "[id='password']",
    loginButton: "[id='submit']",
    signUpButton: "[id='signup']",
    firstNameInput:"input[id='firstName']",
    lastNameInput: "[id='lastName']",
    submitButton: "[id='submit']",
    cancelButton: "[id='cancel']",
    input: "input",
    setUpErrorMessage: "[id='error']"
};

export const fillSetUpFields = (user: { email: string; password: string; firstName: string; lastName: string }) => {
    I.fillField(loginSetUpLocators.firstNameInput, user.firstName);
    I.fillField(loginSetUpLocators.lastNameInput, user.lastName);
    I.fillField(loginSetUpLocators.emailInput, user.email);
    I.fillField(loginSetUpLocators.passwordInput, user.password);
}

export const fillSetUpInvalid = async (user: { email: string; password: string; firstName: string; lastName: string }, invalidFieldLocator: string ) => {
    await fillSetUpFields(user);
    const invalidUserField = invalidateField(invalidFieldLocator);
    I.fillField(invalidFieldLocator, invalidUserField);
}

export const invalidateField = (invalidFieldLocator: string) =>{
    let invalidUserField:string;
    switch (invalidFieldLocator){
        case loginSetUpLocators.emailInput:
            invalidUserField = users.invalidUser.email
            break;
        case loginSetUpLocators.passwordInput:
            invalidUserField = users.invalidUser.password
            break
        default:
            console.log("Irrelevant field chose to test error validation")
    }
    return invalidUserField;
}
export const validateInvalidSetup = async (user: { email: string; password: string; firstName: string; lastName: string }, invalidFieldLocator: string ) => {
    await fillSetUpInvalid(user, invalidFieldLocator)
    I.click(loginSetUpLocators.submitButton);
    I.waitForElement(loginSetUpLocators.setUpErrorMessage);
    let loginEmail:string = user.email;
    let loginPassword: string = user.password;
    let errMsgExpected;
    if (invalidFieldLocator === loginSetUpLocators.emailInput){
        loginEmail = invalidateField(invalidFieldLocator);
        errMsgExpected = errorMessages.setupEmailInvalid;
    }
    else if (invalidFieldLocator === loginSetUpLocators.passwordInput){
        loginPassword = invalidateField(invalidFieldLocator);
        errMsgExpected = errorMessages.setupPasswordInvalid;
    }
    await validateUserExistsAPI(loginEmail, loginPassword, false);
    const errorMsg = await I.grabTextFrom(loginSetUpLocators.setUpErrorMessage);
    assert.strictEqual(errorMsg, errMsgExpected, `\nExpected err message -> ${errMsgExpected}\nSeen err message -> ${errorMsg}`)

}

export const waitAndGrabError = async () => {
    I.waitForElement(loginSetUpLocators.setUpErrorMessage, EWaitTimes.SHORT)
    return await I.grabTextFrom(loginSetUpLocators.setUpErrorMessage);
};