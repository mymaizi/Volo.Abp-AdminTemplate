<template>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'" style="background-color: rgb(84, 92, 100)">
      <div class="el-layout-sider-logo">
        <img v-if="isCollapse" src="../assets/img/logo-small.png" />
        <img v-else src="../assets/img/logo-dark.png" />
      </div>
      <div style="height:calc(100vh - 64px)">
        <el-scrollbar style="height:100%">
          <el-menu
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :unique-opened="true"
            :collapse-transition="false"
            :router="true"
          >
           <el-submenu index="1">
              <template slot="title">
              <i class="el-icon-setting"></i>
              <span>管理</span>
              </template>
              <el-menu-item-group title="身份认证管理">
                <el-menu-item index="/identity/roles">角色</el-menu-item>
                <el-menu-item index="/identity/users">用户</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="租户管理">
                <el-menu-item index="/tenant/tenants">租户</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="16">
            <el-button
              type="text"
              :icon="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
              @click="isCollapse=!isCollapse"
            ></el-button>
            <el-input
              style="width:160px;margin-left:20px"
              v-model="searchValue"
              :clearable="true"
              size="medium"
              placeholder="搜索..."
              prefix-icon="el-icon-search"
            ></el-input>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-badge :value="100" :max="10" style="margin-right:35px">
              <el-button type="text" icon="el-icon-bell"></el-button>
            </el-badge>
            <el-dropdown @command="handleCommand">
              <el-button type="text">
                <el-avatar
                  style="margin-right: 6px;overflow:visible"
                  size="small"
                  icon="el-icon-user-solid"
                ></el-avatar>{{appConfigs.currentUser!=undefined?appConfigs.currentUser.userName:""}}
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i class="el-icon-user"></i>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="/account/profile">
                  <i class="el-icon-setting"></i>设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <i class="el-icon-switch-button"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="background: #f4f5f7">
       <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
.el-badge sup {
  margin-top: 14px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-layout-sider-logo {
  height: 63px;
  line-height: 63px;
  text-align: center;
  border-bottom: 1px solid #f8f8f9;
  overflow: hidden;
}
.el-layout-sider-logo img {
  height: 80%;
  vertical-align: middle;
}
.el-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  line-height: 60px;
}
</style>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isCollapse: false,
      searchValue: "",
    };
  },
  computed:{
    ...mapState(['appConfigs'])
  }, 
  created(){
    this.$store.dispatch('getAppConfigs');
  },
  methods: {
     handleCommand(command) {
       let self=this;
       if(command=="logout"){
         self.$http.get("/api/account/logout").then(function(){
           self.$router.push("/account/login")
         })
       }else{
        self.$router.push(command);
       }
      }
  }
};
</script>
