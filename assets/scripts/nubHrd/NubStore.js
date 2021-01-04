


import localStorage from '../custom/localStorage'
import { levels } from './nubConfig';

export const STORE_KEY = {
    NUBLEVEL1: 'NUBLEVEL1',
    NUBLEVEL2: 'NUBLEVEL2',
    NUBLEVEL3: 'NUBLEVEL3',
    NUBLEVEL4: 'NUBLEVEL4',
}




// function getLevel1Data() {
//     return localStorage.getItem(STORE_KEY.NUBLEVEL1)
// }
// function setLevel1Data(value) {
//     localStorage.setItem(STORE_KEY.NUBLEVEL1, value)
// }

export function getLevelData(level) {
    switch (level) {
        case 1:
            return localStorage.getItem(STORE_KEY.NUBLEVEL1)
            break;
        case 2:
            return localStorage.getItem(STORE_KEY.NUBLEVEL2)
            break;
        case 3:
            return localStorage.getItem(STORE_KEY.NUBLEVEL3)
            break;
        case 4:
            return localStorage.getItem(STORE_KEY.NUBLEVEL4)
            break;
    }
}

export function setLevelData(level, value) {

    const data = getLevelData(level);
    if (data) {
        const dateStr = '2020/01/01' + ' ' + data;
        const dateStr1 = '2020/01/01' + ' ' + value;
        const timestamp = new Date(dateStr).getTime();
        const timestamp1 = new Date(dateStr1).getTime();
        console.log('===', dateStr, dateStr1, timestamp, timestamp1, timestamp1 > timestamp)
        if (timestamp1 > timestamp) return
    }


    switch (level) {
        case 1:
            return localStorage.setItem(STORE_KEY.NUBLEVEL1, value)
            break;
        case 2:
            return localStorage.setItem(STORE_KEY.NUBLEVEL2, value)
            break;
        case 3:
            return localStorage.setItem(STORE_KEY.NUBLEVEL3, value)
            break;
        case 4:
            return localStorage.setItem(STORE_KEY.NUBLEVEL4, value)
            break;
    }
}
