An example of GitHub Actions: sending daily weather report with email.

Visit [my blog](http://www.ruanyifeng.com/blog/2019/12/github_actions.html) (in Chinese) for details.

## References

- [signalnerve/github-actions-weather-bot](https://github.com/signalnerve/github-actions-weather-bot)
- [chubin/wttr.in](https://github.com/chubin/wttr.in)

## 使用 git action 发送天气邮件

 1. 将action.yml 文件中的to邮箱改为自己邮箱
 2. 使用163 需要注册 163 邮箱，并且开启客户端授权
 3. 将授权码添加的github 的项目setting中，注意要和yml文件中的名称一直 。valu为 163的登录名和客户端授权码
 4. 修改提交触发 action 构建