type State = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    errors: {
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
        firstName: string;
        lastName: string;

        // firstName and lastName are validated together; if either are invalid, the name error is returned
        name?: string;
        
        other: string;
    };
}

type Action = {
    type: string;
    payload?: any;
}

export const initialState: State = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    errors: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        other: '',
    },
}

export const SIGNUP_ACTIONS = {
    SET_USERNAME: 'SET_USERNAME',
    SET_EMAIL: 'SET_EMAIL',
    SET_PASSWORD: 'SET_PASSWORD',
    SET_CONFIRM_PASSWORD: 'SET_CONFIRM_PASSWORD',
    SET_FIRST_NAME: 'SET_FIRST_NAME',
    SET_LAST_NAME: 'SET_LAST_NAME',
    SET_ERRORS: 'SET_ERRORS',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    CLEAR_FIELDS: 'CLEAR_FIELDS',
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case SIGNUP_ACTIONS.SET_USERNAME:
            return {
                ...state,
                username: action.payload,
            }
        case SIGNUP_ACTIONS.SET_EMAIL:
            return {
                ...state,
                email: action.payload,
            }
        case SIGNUP_ACTIONS.SET_PASSWORD:
            return {
                ...state,
                password: action.payload,
            }
        case SIGNUP_ACTIONS.SET_CONFIRM_PASSWORD:
            return {
                ...state,
                confirmPassword: action.payload,
            }
        case SIGNUP_ACTIONS.SET_FIRST_NAME:
            return {
                ...state,
                firstName: action.payload,
            }
        case SIGNUP_ACTIONS.SET_LAST_NAME:
            return {
                ...state,
                lastName: action.payload,
            }
        case SIGNUP_ACTIONS.SET_ERRORS:
            return {
                ...state,
                errors: action.payload,
            }
        case SIGNUP_ACTIONS.CLEAR_ERRORS:
            return {
                ...state,
                errors: initialState.errors,
            }
        case SIGNUP_ACTIONS.CLEAR_FIELDS:
            return {
                ...initialState,
            }
        default:
            return state;
    }
}
