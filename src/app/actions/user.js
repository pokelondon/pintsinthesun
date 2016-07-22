export const AUTH_USER = 'auth_user';

export function authUser(isAuthed) {

    return {
        type: AUTH_USER,
        isAuthed
    }
}
