import axios from "axios"
import VueAxios from "./plugins/axios"

import swal from 'sweetalert2'
import VueSwal from "./plugins/sweetalert2"


import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import VueToastr from "./plugins/toastr"

import _ from 'lodash'
import VueLoadsh from "./plugins/lodash"

import {environment} from './environment'

import qs from 'qs'
import VueQs from "./plugins/qs"

import Tools from "./plugins/tools"

export default {
  install(Vue) {
    //在此进行axios基础设置 详情参考axios官方文档
    axios.defaults.baseURL=environment.apis.default.url;
    Vue.use(VueAxios, axios)
    //设置弹窗插件
    Vue.use(VueSwal, swal)
    //设置提示插件
    Vue.use(VueToastr, toastr)
    //设置工具库
    Vue.use(VueLoadsh, _)
    //设置qs
    Vue.use(VueQs, qs)
    //设置tools
    Vue.use(Tools,...[_,qs])
  }
}

