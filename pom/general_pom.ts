import assert from "node:assert";

const { I } = inject();

export const users = {
    yishaiMarkovitz: {
        email:'yishai.markovitz@similarweb.com',
        password: 'qacourse1',
        firstName: "Yishai",
        lastName: "Markovitz"

    },
    yishaiMarkovitz2: {
        email:'yishaimarkovitz@similarweb.com',
        password: 'qacourse2',
        firstName: "Yishai2",
        lastName: "Markovitz2"
    },
    invalidUser: {
        email: "brokenusergmail.com",
        password: '123456',
    }
}
export enum EUrls {
    loginPage = "https://thinking-tester-contact-list.herokuapp.com/login",
    setup = 'https://thinking-tester-contact-list.herokuapp.com/addUser',
}

export const errorMessages = {
    setupEmailInvalid: "User validation failed: email: Email is invalid",
    setupPasswordInvalid: `User validation failed: password: Path \`password\` (\`${users.invalidUser.password}\`) is shorter than the minimum allowed length (7).`,
    setupDuplicateUser: "Email address is already in use",
}
export enum EWaitTimes {
    SHORT = 2,
    MEDIUM = 5,
    LONG= 10,
}

const endpoints = {
    login: 'https://thinking-tester-contact-list.herokuapp.com/users/login?',
    deleteUser: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
}

export const loginApiRequest = async (email: string, password: string) => {
    try {
        const response = await fetch(endpoints.login, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: response.ok,
                status: response.status,
                error: data || `HTTP error! Status: ${response.status}`,
            };
        }
        return {
            data: data,
            success: response.ok,

        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Unknown error occurred',
        };
    }
};

export const deleteUserAPI = async (token:string) => {
    try {
        const response = await fetch(endpoints.deleteUser, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete resource. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during DELETE request:', error);
        throw error;
    }
};

export const validateUserExistsAPI = async (email: string, password: string, expectedStatus: boolean) => {
    const userStatus = await loginApiRequest(email, password);
    if (expectedStatus) {
        assert.strictEqual(userStatus.success, expectedStatus, "Expected user creation to be successful and saw it was unsuccesful");
    } else {
        assert.strictEqual(userStatus.success, false, "Expected user creation to have failed and saw it was successful");
    }
}

export const validateUrl = async (expectedUrl: EUrls) => {
    const actualUrl = await I.grabCurrentUrl();
    assert.strictEqual(actualUrl, expectedUrl, `Expected URL: ${expectedUrl} - Actual URL: ${actualUrl}`);
};