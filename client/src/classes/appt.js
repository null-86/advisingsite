import db from '../API/ApptAPI';

class appt {
    id; 
    advisorCwid;
    studentCwid; 
    location;
    yr;
    mnth;
    dayNum;
    startTime;
    endTime;
    title;

    constructor(id, advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime, location, title) {
        this.id = id; 
        this.advisorCwid = advisorCwid;
        this.studentCwid = studentCwid;
        this.yr = yr;
        this.mnth = mnth;
        this.dayNum = dayNum;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.title = title

        // this.title = this.getTitle();
        // console.log(this.title);
    }

    getId() {
        return this.id;
    }

    // async getTitle() {
    //     if (this.studentCwid == null) {
    //         this.title = "Open";
    //         // callback("Open");
    //     } else {
    //         var res =
    //         await db.getName(String(this.studentCwid)).then(function(resolve, reject) {
    //             console.log( resolve[0]["name"].toString().replace("  ", " "));
    //             res = resolve[0]["name"].toString().replace("  ", " ");
    //             resolve(res);
    //             // callback(res);
    //         })
    //     }
    //     console.log("alalalalala " + res);
    // }

    getTitle() {
        if (this.title == null) {
            return "Open";
        } else {
            return this.title;
        }
        // var res = await db.getName(this.studentCwid);
        // console.log(res[0].name.toString().replace("  ", " "));
        // if (res) {
        //     return res[0].name.toString().replace("  ", " ");
        // } else {
        //     return "Open";
        // }
        
        // console.log("..................................................")
        // this.loadTitle();
        
        // // poll every 20 ms
        // // ps: sry for the bad programming
        // while (this.title == null) {
        //     console.log(this.title);
        //     setTimeout(20);
        // }
        
        // return this.title;
    }
/////  I know this loadTitle method is terrible, but I hate javascript.
// js just feels like it can magically fork at the call to db.getName and return the var before it has a value
// According to stackOverflow there is 
// no known workaround. Someone more familiar with js could fix this, but I don't even care anymore
// I'm just going to make a timer in getTitle that polls for the result
    // async loadTitle() {
    //     if (this.studentCwid == null) {
    //         this.title = "Open";
    //         // callback("Open");
    //     } else {
    //         var res =
    //         db.getName(String(this.studentCwid)).then(function(e) {
    //             // console.log(e[0]["name"].toString().replace("  ", " "));
    //             res = e[0]["name"].toString().replace("  ", " ");
                
    //             // callback(res);
    //         })
    //     }
    // }

    // note: the "T" indicates that a time value follows 
    getStartDate() {
        return this._getDate() + 'T' + this._formatTime(this.startTime);
    }

    // note: the "T" indicates that a time value follows 
    getEndDate() {
        return this._getDate() + 'T' + this._formatTime(this.endTime);
    }

    getAllDay() {
        return false; // this is not used in our system
    }

    getLocation() {
        return this.location;
    }

    // format our date object according to the format provided by the framework
    // https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/reference/scheduler/#schedulerdatetime
    getScheduleItem() {
        return {
            studentCwid: this.studentCwid,
            startDate: this.getStartDate(), 
            endDate: this.getEndDate(), 
            title: this.getTitle(), 
            allDay: this.getAllDay(), 
            id: this.getId(), 
            location: this.getLocation()
        };
    }

    // private methods
    
    _getDate() {
        // cast to string to allow string manipulation
        this.yr = String(this.yr);
        this.mnth = String(this.mnth);
        this.dayNum = String(this.dayNum);

        while (this.yr.length < 4) {
            this.yr = "0" + this.yr;
        }

        if (this.mnth.length < 2) {
            this.mnth = "0" + this.mnth;
        }

        if (this.dayNum.length < 2) {
            this.dayNum = "0" + this.dayNum;
        }

        return '' + this.yr + '-' + this.mnth + '-' + this.dayNum;
    }

    _formatTime(time) {

        // extract hrs and mins
        time = "" + time;
        var hrs;
        var mins;

        // our database stores time as an int in military time, meaning that input could be anywhere from 
        // 2 - 4 chars long (assuming no bugs)
        // this code is ugly, but it should handle our times adequately
        if (time.length <= 2) {
            hrs = 0;
            mins = time;
        } 
        else if (time.length == 3) {
            hrs = time.slice(0,1);
            mins = time.slice(1,3);
        }
        else {
            hrs = time.slice(0,2);
            mins = time.slice(2,4);
        }
        
        //console.log(hrs + ' ' + mins);

        // cast to int  
        hrs = parseInt(hrs);
        mins = parseInt(mins);
        
        // normalize
        hrs = hrs % 24;
        hrs += parseInt(mins/60);
        mins = mins % 60;

        // add leading zeros
        hrs = String(hrs);
        mins = String(mins);

        
        if (hrs.length < 2) {
            hrs = "0" + hrs;
        }

        if (mins.length < 2) {
            mins = "0" + mins;
        }

        //console.log("formatted time: " + hrs + ":" + mins);
  
        return "" + hrs + ":" + mins;
    }
}
/*
class timeSlot {
    id; 
    advisorCwid;
    yr;
    mnth;
    dayNum;
    startTime;
    endTime;

    constructor(id, advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime) {
        this.id = id; 
        this.advisorCwid = advisorCwid;
        this.studentCwid = studentCwid;
        this.yr = yr;
        this.mnth = mnth;
        this.dayNum = dayNum;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    getStartDate() {

        return;
    }
}

class appt extends timeSlot {
    studentCwid; 
    location;

    constructor(id, advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime, location) {
        super(id, advisorCwid, studentCwid, yr, mnth, dayNum, startTime, endTime);

        this.studentCwid = studentCwid;
        this.location = location;
    }
};
*/

export default appt;