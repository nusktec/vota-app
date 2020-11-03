/**
 * Created by revelation on 21/05/2020.
 */
class tmpUtils {

//time ago
    static time_ago(ts) {

        let seconds = Math.floor((new Date() - ts) / 1000);

        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

//get random number
    static getRandomChar(length) {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let tLenght = chars.length - 1;
        let res = "";
        for (let i = 0; i <= length; i++) {
            res += chars[parseInt((Math.random() * tLenght + 1))];
        }
        return res;
    }
}

module.exports = tmpUtils;