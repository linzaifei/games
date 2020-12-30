



//开始定时器
function startSchedule(component, fun, time = 1) {
    component.schedule(fun, time)
}
function stopSchedule(component, fun) {
    component.unschedule(fun)
}

function startTime(component, callback) {

    let s = 0;
    let m = 0;
    let h = 0;
    this.callback = () => {
        s++;
        if (s / 60 == 1) {
            s = 0;
            m++;
        };
        if (m / 60 == 1) {
            m = 0;
            h++;
        };
        if (h / 24 == 1) {
            h = m = s == 0;
        }
        const h1 = h < 10 ? '0' + h : h
        const m1 = m < 10 ? '0' + m : m
        const s1 = s < 10 ? '0' + s : s
        // console.log('time', h1 + ":" + m1 + ':' + s1)
        callback && callback(h1 + ":" + m1 + ':' + s1)
    }

    startSchedule(component, this.callback)
}

function stopTime(component) {
    stopSchedule(component, this.callback);
}

export default {
    startSchedule,
    stopSchedule,
    startTime,
    stopTime,
}

