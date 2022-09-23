
import CookieService from './CookieService.ts';
import { CLIENT_ROOT } from './constants.js';

const logout = async () => {
    CookieService.remove("user-cookie");
    window.location.assign(CLIENT_ROOT); //
    //window.location.href(CLIENT_ROOT);
    window.location.reload(true);
}

export default logout;