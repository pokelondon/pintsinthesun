export const SHOW_DIALOG = 'show_dialog';
export const CLOSE_DIALOG = 'close_dialog';
export const LAUNCH_INFO_MODAL = 'launch_info_modal';
export const CLOSE_MODAL = 'close_modal';
export const HIDE_SLIDER_TIP = 'HIDE_SLIDER_TIP';

export function showDialog(message, moreInfo){
    return {
        type: SHOW_DIALOG,
        payload: {message, moreInfo}
    }
}

export function closeDialog(){
    return {
        type: CLOSE_DIALOG
    }
}

export function launchInfoModal(){
    return function(dispatch) {
        dispatch({
            type: LAUNCH_INFO_MODAL
        });
    }
}

export function closeModal(){
    return function(dispatch) {
        dispatch({
            type: CLOSE_MODAL
        });
    }
}

export function hideSliderTip(){
    return {
        type: HIDE_SLIDER_TIP
    }
}