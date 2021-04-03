import { loginReducer } from './loginReducer';
import { signupReducer } from './signupReducer';
import { dashboardReducer } from './dashboardReducer';
import { profileReducer } from './profileReducer';
import { myProfileReducer } from './myProfileReducer';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
    loginReducer,
    signupReducer,
    dashboardReducer,
    profileReducer,
    myProfileReducer
})