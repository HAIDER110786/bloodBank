const initState = {
    userData: null,
    userDataLoading: true,
    records:[],
    recordsLoading: true,
    comments: [],
    commentsLoading: true,
    RequestedBlood: null,
    error:''
}

export const profileReducer = (state = initState, action) =>{
    switch(action.type){
        case 'LOADING_USERS':
            return{
                ...state,
                userDataLoading : true,
            }   
        case 'SHOW_USERS':
            return{
                ...state,
                userDataLoading : false,
                userData: action.payload.userData,
            }
        case 'SHOW_PROFILE_USER_ERROR':
            return{
                ...state,
                userDataLoading : false,
                error: action.payload.error.message,
            }
        case 'LOADING_RECORDS':
            return{
                ...state,
                recordsLoading : true,
            }
        case 'SHOW_RECORDS':
            return{
                ...state,
                recordsLoading : false,
                records: action.payload.userRecords,
            }
        case 'SHOW_PROFILE_RECORD_ERROR':
            return{
                ...state,
                recordsLoading : false,
                error: action.payload.error.message,
            }
        case 'LOADING_COMMENTS':
            return{
                ...state,
                commentsLoading : true,
            }
        case 'SHOW_COMMENTS':
            return{
                ...state,
                commentsLoading : false,
                comments: action.payload.profileComments,
            }
        case 'SHOW_PROFILE_COMMENTS_ERROR':
            return{
                ...state,
                commentsLoading : false,
                error: action.payload.error.message,
            }
        case 'PROFILE_CHECKING_BLOOD_REQUEST':
            return{
                ...state,
                RequestedBlood: action.payload.requested,
            }
        // case 'SHOW_PROFILE_COMMENTS_ERROR':
        //     return{
        //         ...state,
        //         commentsLoading : false,
        //         error: action.payload.error.message,
        //     }
        case 'MAKE_BLOOD_REQUEST':
            return{
                ...state,
                RequestedBlood: true,
            }
        case 'BLOOD_REQUESTING_ERROR':
            return{
                ...state,
                error: action.payload.error.message,
            }
        default:
            return state;
    }
} 