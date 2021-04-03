const initState = {
    denied:null,
    error:'',
    status:'',
};

export const loginReducer = (state = initState, action) =>{
    switch (action.type){
        case 'SHOW_ERROR':
            return{
                ...state,
                denied:null,
                error: action.payload.message,
            }
        case 'VALID_AUTHORIZATION':
            return{
                ...state,
                denied:null,
                error:null,
                status:'approved'
            }
        case 'INVALID_AUTHORIZATION':
            return{
                ...state,
                error:null,
                denied:action.payload,
            }
        case 'RESET':
            return{
                ...state,
                denied:null,
                error:'',
                status:''
            }
        default:
            return state;
    }
}