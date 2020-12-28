
import LocalStorage from "./localStorage";

function login() {
    if (window.wx) {
        wx.login().then((ret) => {
            console.log('登录成功', ret)
            LocalStorage.setCode(ret.code)
        })

        window.wx.getSetting({
            success(res) {
                console.log(res.authSetting);
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    wx.getUserInfo({
                        success(res) {
                            console.log("用户授权:", res)
                            LocalStorage.setUserInfo(res.userInfo)
                        }
                    });
                } else {
                    console.log("用户未授权");
                    wx.getSystemInfo({
                        success: (data) => {
                            const width = data.screenWidth;
                            const height = data.screenHeight;
                            const button = window.wx.createUserInfoButton({
                                type: 'text',
                                text: '',
                                style: {
                                    left: 0,
                                    top: 0,
                                    width: width,
                                    height: height,
                                    backgroundColor: '#00000000',//最后两位为透明度
                                    color: '#ffffff',
                                    fontSize: 20,
                                    textAlign: "center",
                                    lineHeight: height,
                                }
                            });
                            button.onTap((res) => {
                                if (res.userInfo) {
                                    console.log("用户授权:", res);
                                    LocalStorage.setUserInfo(res.userInfo)

                                    button.destroy();
                                } else {
                                    console.log("用户拒绝授权:", res);
                                }
                            });
                        }
                    });

                }
            }
        })

    }
}
export default {

    login,

}