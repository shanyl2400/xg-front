
import logo from '../logo.png';
//桌面提醒
export function notify(title, content, onclick) {

    if (!title && !content) {
        title = "桌面提醒";
        content = "您看到此条信息桌面提醒设置成功";
    }
    var iconUrl = logo;

    if ("Notification" in window) {
        // 判断是否有权限
        if (Notification.permission === "granted") {
            var notification = new Notification(title, {
                "icon": iconUrl,
                "body": content,
            });
        }
        //如果没权限，则请求权限
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // Whatever the user answers, we make sure we store the
                // information
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                //如果接受请求
                if (permission === "granted") {
                    var notification = new Notification(title, {
                        "icon": iconUrl,
                        "body": content,
                    });

                    notification.onclick = function () {
                        window.open("http://localhost:3000/main/order_notify", '_blank');      // 打开网址
                    };
                }
            });
        }
    }
}