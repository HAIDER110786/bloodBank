const initState = {
    isLoading:false,
    users:[],
    error:'',
}

export const dashboardReducer = (state = initState, action) =>{
    switch (action.type){
        case 'LOADING':
            return{
                ...state,
                isLoading:true,
            }
        case 'SHOW_USERS':
            return{
                ...state,
                isLoading:false,
                users:action.payload.users,
            }
        case 'RENDER_ERROR':
            return{
                ...state,
                isLoading:false,
                error: action.payload.message,
            }
        default:
            return state;
    }
}