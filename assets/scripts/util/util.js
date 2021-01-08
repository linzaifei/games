
//倒序
function getReverseArr(arr) {
    return arr.reverse()
}

//一个数组随机打乱 (不行)
function randomArr(arr) {
    const len = arr.length;
    for (let i = len - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}
//分割数组
function spliceArr(arr, count = 3) {
    const dataArr = []
    // console.log('===arr', arr);
    for (let i = 0; i < arr.length; i += count) {
        dataArr.push(arr.slice(i, i + count));
    }
    return dataArr;
}

export function forIn(row, col, callback, rowbcak) {
    for (let x = 0; x < row; x++) {
        rowbcak && rowbcak(x)
        for (let y = 0; y < col; y++) {
            callback && callback(x, y)
        }
    }
}

//数组旋转90度
export function rotateArr(arr) {
    const len = arr.length;
    const rotaArr = []
    forIn(len, len, (x, y) => {
        rotaArr[x][y] = arr[y][len - 1 - x];
    }, (x) => {
        rotaArr[x] = []
    })
    return rotaArr;
}


export default {
    getReverseArr,
    randomArr,
    spliceArr,

}