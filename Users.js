/**
 * Created by jamesho on 27/02/2018.
 */

module.exports = {
    /**
     *
     * @param db
     * @param user
     * @returns {*}
     */
    find: function (db, user) {
        for (let i of db.userDb.users) {
            if (i.userId == user)
                return i;
        }
        return null;
    },
    /**
     *
     * @param user
     * @returns {number}
     */
    findDaysToBirthday: function (user) {
        let today = moment();
        let tmpDay = moment(user.birthday, 'YYYY-MM-DD').year(today.year());
        let daysToBDay = 0;

        if (tmpDay.isSame(today))
            daysToBDay = 0;
        else if (tmpDay.isAfter(today))
            daysToBDay = tmpDay.diff(today, 'days') + 1;
        else {
            daysToBDay = tmpDay.year(tmpDay.year() + 1).diff(today, 'days') + 1;
        }

        return daysToBDay;
    },
    /**
     *
     * @param user
     * @returns {number}
     */
    findAge: function (user) {
        let age = Math.floor((moment().diff(moment(user.birthday, 'YYYY-MM-DD'), 'days')) / 365);

        // forever young mom XDDD
        if (user.userId == 'Ua686b3b6f5a0fefb00f7897cef7a58c8')
            return Math.floor(age / 2);
        return age;
    }
};


