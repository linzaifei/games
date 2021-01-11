


export const STORE_KEY = {
    USERINFO: 'USERINFO',//主题KEY
    CODE: 'CODE',
    OPENID: 'OPENID',
    KEY2048: 'KEY2048',//2048积分
    KEYTETRIS: 'KEYTETRIS',//俄罗斯方块积分
}


function setItem(key, value) {
    if (!key || !value) {
        throw new Error('key为空')
        return
    }
    cc.sys.localStorage.setItem(key, value)
}

function getItem(key) {
    if (!key) {
        throw new Error('key为空')
        return
    }
    return cc.sys.localStorage.getItem(key)
}

function removeItem(key) {
    if (!key) {
        throw new Error('key为空')
        return
    }
    cc.sys.localStorage.removeItem(key)
}

/** 个人信息 */
function getUserInfo() {
    return JSON.parse(getItem(STORE_KEY.USERINFO))
}
function setUserInfo(value) {
    setItem(STORE_KEY.USERINFO, JSON.stringify(value))
}

/** code */
function getCode() {
    return getItem(STORE_KEY.CODE)
}
function setCode(value) {
    setItem(STORE_KEY.CODE, value)
}

/** openid */
function getOpenId() {
    return getItem(STORE_KEY.OPENID)
}
function setOpenId(value) {
    setItem(STORE_KEY.OPENID, value)
}





/*******************************************游戏*************************************************/
//保存2048 数据
function get2048Score() {
    return Number(getItem(STORE_KEY.KEY2048)) ? Number(getItem(STORE_KEY.KEY2048)) : 0
}
//保存2048 数据
function set2048Score(value) {
    setItem(STORE_KEY.KEY2048, String(value))
}

//保存俄罗斯方块 数据
function getTrteisScore() {
    return Number(getItem(STORE_KEY.KEYTETRIS)) ? Number(getItem(STORE_KEY.KEYTETRIS)) : 0
}
//保存俄罗斯方块 数据
function setTrteisScore(value) {
    setItem(STORE_KEY.KEYTETRIS, String(value))
}


export default {
    setItem,
    getItem,
    getUserInfo,
    setUserInfo,
    getCode,
    setCode,
    getOpenId,
    setOpenId,
    set2048Score,
    get2048Score,
    getTrteisScore,
    setTrteisScore,
}