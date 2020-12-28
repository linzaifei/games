import LocalStorage from "./custom/localStorage";


//初始化云服务
function initCloud() {

    console.log('初始化方法，从配置文件中读取参数')

    // wx.cloud.init({
    //     env: 'game-dev-5gxyq0ed51a09542',
    //     traceUser: true,
    // })

    //初始化方法，从配置文件中读取参数
    // this.app = cc.cloud && cc.cloud.initialize();
    // const auth = this.app.auth();
    // auth.anonymousAuthProvider().signIn().then(res => {
    //     // 需要先做授权，云函数才能正常调用，本例子中使用匿名登录方式访问云开发资源，返回后可视为初始化完成
    //     // 建议后期改为授权登录模式
    //     console.log('TCB inited 初始化成功');
    // }).catch(e => console.log(e));
}

function getIndex() {
    // wx.cloud.callFunction({
    //     name: "index",
    //     data: {
    //         a: 1
    //     }
    // }).then(res => {
    //     console.log('function', res);
    // }).catch(console.error);
    // getOpenId().then(ret => {

    // })
}


function getOpenId() {
    console.log('===code=', LocalStorage.getCode())
    const code = LocalStorage.getCode()
    return new Promise((reslove, reject) => {
        if (LocalStorage.getCode()) {
            console.log('进入')
            this.app.callFunction({
                name: "login",
                data: {
                    code: code,
                }
            }).then(res => {
                console.log('==res=', res)
                const openId = res.result.openid
                if (openId) {
                    LocalStorage.setCode('');
                    LocalStorage.setOpenId(openId)
                }
                reslove(openId)
            }).catch(console.error);
        } else {
            const openId = LocalStorage.getOpenId();
            reslove(openId)
        }
    })
}





export default {
    initCloud,
    getIndex,
    getOpenId,
}