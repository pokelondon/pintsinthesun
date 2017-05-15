export const SHOW_DIALOG = 'show_dialog';
export const CLOSE_DIALOG = 'close_dialog';
export const LAUNCH_INFO_MODAL = 'launch_info_modal';
export const CLOSE_MODAL = 'close_modal';

export function showDialog(message){
    return {
        type: SHOW_DIALOG,
        message
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