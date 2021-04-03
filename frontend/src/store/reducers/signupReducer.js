const initState = {
    denied:null,
    approved:null,
    error:''
};

export const signupReducer = (state = initState, action) =>{
    switch (action.type){
        case 'SHOW_ERROR':
            return{
                ...state,
                denied:null,
                error: action.payload.message,
            }
        case 'VALID_REGISTRATION':
            return{
                ...state,
                denied:null,
                error:null,
                approved:action.payload
            }
        case 'INVALID_REGISTRATION':
            return{
                ...state,
                error:null,
                denied:action.payload,
                approved:null,
            }
        // case 'RESET':
        //     return{
        //         ...state,
        //         denied:null,
        //         error:''
        //     }
        default:
            return state;
    }
}