

import util from '../util/util'

export const levels = {
    '1': {
        level: 9,
        title: '3X3'
    },
    '2': {
        level: 16,
        title: '4X4'
    },
    '3': {
        level: 25,
        title: '5X5'
    },
    '4': {
        level: 36,
        title: '6X6'
    }
}



//冒泡排序 
export const bubbleOrder = (arr) => {
    let i, j, count = 0;
    const swap = (tar, lastIndex, newIndex) => {
        let temp = tar[lastIndex];
        tar[lastIndex] = tar[newIndex];
        tar[newIndex] = temp;
        count++;
    }
    for (i = 0; i < arr.length; i++) {
        for (j = arr.length - 1; j > i; j--) {
            (arr[j] < arr[j - 1]) && swap(arr, j - 1, j);
        }
    }
    return count;
}


function getArr(arr, nub) {
    const dataArr = arr.map(item => { return item });

    const count = bubbleOrder(dataArr);
    console.log('count=', count, count / 2, count % 2, arr, dataArr)
    if (nub % 2 == 1 && count % 2 == 0) {
        console.log('奇数第一次')
        return arr
    } if (nub % 2 == 0 && count % 2 == 1) {
        console.log('偶数第一次')
        return arr
    } else {
        console.log('第二次', nub)
        arr = util.randomArr(arr);
        return getArr(arr, nub)
    }
}




export function getArrWithLevel(level, count) {
    const len = levels[String(level)].level;
    let arr = Array.from({ length: len - 1 }, (v, k) => k + 1);
    arr = util.randomArr(arr);
    arr = getArr(arr, count);
    console.log('==arr', arr)
    const dataArr = util.spliceArr(arr, count)

    return {
        dataArr: dataArr,
        title: levels[String(level)].title,
    }
}