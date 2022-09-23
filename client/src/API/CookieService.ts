import Cookie from 'universal-cookie';
import { COOKIE_LIFETIME } from '../API/constants';

/* 
    CookieService is a wrapper class for the universal-cookie's Cookie class. we don't stricty
    need to do it this way, but the tutorial recommends it since it allows us finer control. 
*/

const cookie = new Cookie();

class CookieService {
    get(key: string) {
        return cookie.get(key);
    }

    set(key: string, value: string, options: Object) {
        cookie.set(key, value, options);
    }

    exists(key: string) {
        return cookie.get(key) != null;

    }

    
    refresh(key: string) {
        if (this.exists(key)) {
            // get current
            var cookie = this.get(key);
            // remove current
            this.remove(key);
            // add new version
            var milliseconds = Math.round(COOKIE_LIFETIME * 3600000);
            var expireDate = new Date(Date.now() + milliseconds);
            var options = { expires: expireDate, sameSite: "lax" };
            this.set(key, cookie, options);
        }
    }

    remove(key: string) {
        cookie.remove(key);
    }
}

export default new CookieService();