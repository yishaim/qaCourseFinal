import {errorMessages, users, validateUserExistsAPI} from "./general_pom";
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
    if (invalidFieldLocator !== "duplicate"){
        const invalidUserField = invalidateField(invalidFieldLocator);
        I.fillField(invalidFieldLocator, invalidUserField);
    }
}

export const invalidateField = (invalidFieldLocator: string) =>{
    let invalidUserField:string = "Unselected invalid field";
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
export const validateInvalidSetup = async (user: { email: string; password: string; firstName: string; lastName: string }, invalidType: string, expectedUserStatus:boolean) => {
    let loginEmail:string = user.email;
    let loginPassword: string = user.password;
    let errMsgExpected;
    await fillSetUpInvalid(user, invalidType)
    I.click(loginSetUpLocators.submitButton);
    I.waitForElement(loginSetUpLocators.setUpErrorMessage);
    switch(invalidType){
        case loginSetUpLocators.emailInput:
            loginEmail = invalidateField(invalidType);
            errMsgExpected = errorMessages.setupEmailInvalid;
            break
        case loginSetUpLocators.passwordInput:
            loginPassword = invalidateField(invalidType);
            errMsgExpected = errorMessages.setupPasswordInvalid;
            break
        case "duplicate":
            errMsgExpected = errorMessages.setupDuplicateUser;
            break
        default:
            console.log("Irrelevant invalid type")
    }
    await validateUserExistsAPI(loginEmail, loginPassword, expectedUserStatus);
    const errorMsg = await I.grabTextFrom(loginSetUpLocators.setUpErrorMessage);
    assert.strictEqual(errorMsg, errMsgExpected, `\nExpected err message -> ${errMsgExpected}\nSeen err message -> ${errorMsg}`)

}