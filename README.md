#### 问题处理
1. 修复权限设置bug（2020.11.2）[如果后端新增了权限，会出现无法操作问题，目前修复了但也有一个问题就是管理员只能对未设置的进行设置不能继续修改设置，其他角色人员不受影响]
2. 新增设置页面（2020.11.2）[基础版（angular）没有提供设置页面，对比商业版便增加了该功能，目前只做了身份标识处理,这里需要配合后端实现相应接口],主题我用不着所以没搞,帐户通过在线文档只找到了接口部分,猜测没有使用仓储,需要的小伙伴可以那个啥...暂时不去倒腾了[传送门](https://docs.abp.io/api-docs/commercial/rel-3.3/api/Volo.Abp.Account.AccountSettingsController.html)

***
MyWorld是我本地项目区别于该仓储（有以下区别 1:导航有单独页面动态操作，2:有动态表管理页面[还未实现动态试图功能，需要写样式和研究拖拽操作]，3:设置[配合后端接口])，所以对你有帮助发现有问题可咨询我或者自己解决下，我直接上传或修改的该仓储难免会搞错

# 正题
MyWorld是我自己de项目,不晓得取啥名字,但是又想建一个项目所以...
1. Volo.ABP后端
2. WPF桌面客户端
3. Vue-Web后台（基本保持和Angular版本一致）
4. Flutter-App端（目前还没创建,如果需要会选择Flutter）

## 重要的事情说三遍[不喜勿喷][不喜勿喷][不喜勿喷]

### 用了哪些？以及如何使用？

1. axios(注意plugins文件夹)
2. element-ui（...）
3. jquery(在webpack中直接引入,注意查看vue.config.js)
4. qs(注意plugins文件夹)
5. sweetalert2(注意plugins文件夹)
6. toastr(注意plugins文件夹)
7. vue（...）
8. vue-router（用于拦截验证授权）
9. vuex（存储用户信息）

***
在environment.js配置abp项目授权信息以及接口地址  
用 vs code 打开项目 运行 "vue ui" 启动即可
