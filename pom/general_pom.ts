import assert from "node:assert";

const { I } = inject();

interface LoginApiResponse {
    success: boolean;
    status?: number;
    error?: string;
    data?: {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            __v: number;
        };
        token: string;
    };
}

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

export const loginApiRequest = async (email: string, password: string): Promise<LoginApiResponse> => {
    try {
        const response = await fetch(endpoints.login, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        let data: any;
        if (!response.ok) {
            const errorBody = await response.text();
            return {
                success: false,
                status: response.status,
                error: errorBody || `HTTP error! Status: ${response.status}`,
            };
        }
        try {
            data = await response.json();
        } catch (jsonError) {
            const jsonErrorMessage = (jsonError as Error).message; // Type assertion
            return {
                success: false,
                error: 'Failed to parse JSON response: ' + jsonErrorMessage,
            };
        }
        return {
            data: data,
            success: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message || 'Unknown error occurred',
            };
        } else {
            return {
                success: false,
                error: 'Unknown error occurred',
            };
        }
    }
};

export const deleteUserAPI = async (token: string) => {
    try {
        const response = await fetch(endpoints.deleteUser, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (!response.ok) {
            throw new Error(`Failed to delete resource. Status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error('Error during DELETE request:', error);
        throw error;
    }
};
export const validateUserExistsAPI = async (email: string, password: string, expectedStatus:boolean = true) => {
    const userStatus = await loginApiRequest(email, password);
    assert.strictEqual(userStatus.success, expectedStatus, `Expected user existance to be ${expectedStatus}\nSaw it was ${userStatus.success}`);
}
export const validateUrl = async (expectedUrl: EUrls) => {
    const actualUrl = await I.grabCurrentUrl();
    assert.strictEqual(actualUrl, expectedUrl, `Expected URL: ${expectedUrl} - Actual URL: ${actualUrl}`);
};