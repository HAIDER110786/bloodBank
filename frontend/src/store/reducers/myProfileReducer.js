const initState = {
    userData: null,
    userDataLoading: true,
    records:[],
    recordsLoading: true,
    comments: [],
    commentsLoading: true,
    RequestedBlood: null,
    error:'',
    showBloodRequestAlert:false,
    showNewCommentAlert:false,
    reloadAndRebowl: false,
    requestListData: [],
    requestListLoading: false,
    commentListLoading: false,
    commentListData: [],
}

export const myProfileReducer = (state = initState, action) => {
    switch(action.type){
        case 'LOADING_MY_DATA':
            return{
                ...state,
                userDataLoading : true,
            }   
        case 'SHOW_MY_DATA':
            return{
                ...state,
                userDataLoading : false,
                userData: action.payload,
            }
        case 'MY_DATA_FETCH_ERROR':
            return{
                ...state,
                userDataLoading : false,
                error: action.payload.error.message,
            }
        case 'LOADING_MY_RECORDS':
            return{
                ...state,
                recordsLoading : true,
            }
        case 'SHOW_MY_RECORDS':
            return{
                ...state,
                recordsLoading : false,
                records: action.payload,
            }
        case 'MY_RECORDS_FETCH_ERROR':
            return{
                ...state,
                recordsLoading : false,
                error: action.payload.error.message,
            }
        case 'LOADING_MY_COMMENTS':
            return{
                ...state,
                commentsLoading : true,
            }
        case 'SHOW_MY_COMMENTS':
            return{
                ...state,
                commentsLoading : false,
                comments: action.payload,
            }
        case 'MY_COMMENTS_FETCH_ERROR':
            return{
                ...state,
                commentsLoading : false,
                error: action.payload.error.message,
            }
        case 'SHOW_BLOOD_REQUEST_ALERT':
            return{
                ...state,
                showBloodRequestAlert:true,
            }
        case 'HIDE_BLOOD_REQUEST_ALERT':
            return{
                ...state,
                showBloodRequestAlert:false,
            }
        case 'SHOW_NEW_COMMENT_ALERT':
            return{
                ...state,
                shownewcommentalert:true,
            }
        case 'HIDE_NEW_COMMENT_ALERT':
            return{
                ...state,
                shownewcommentalert:false,
            }
        case 'DISABLE_RELOAD':
            return{
                ...state,
                reloadAndRebowl:false,
            }
        case 'ENABLE_RELOAD':
            return{
                ...state,
                reloadAndRebowl:true,
            }
        case 'LOADING_REQ_LIST':
            return{
                ...state,
                requestListLoading:true,
            }
        case 'SHOW_REQ_LIST':
            return{
                ...state,
                requestListLoading:false,
                requestListData:action.payload,
            }
        case 'LOADING_COMMENT_LIST':
            return{
                ...state,
                commentListLoading:true,
            }
        case 'SHOW_COMMENT_LIST':
            return{
                ...state,
                commentListLoading:false,
                commentListData:action.payload,
            }
        default:
            return state;
    }
}