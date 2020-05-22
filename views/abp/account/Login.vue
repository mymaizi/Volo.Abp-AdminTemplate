<template>
  <el-container>
    <el-main>
      <div class="el-main-form">
        <div style="padding: 32px 0;">
          <img src="@/assets/img/logo.png" alt="logo" height="75px" />
          <div style="font-size: 14px;color:#808695;">从这里开始你的表演...</div>
        </div>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名称或邮箱地址"
              clearable
              prefix-icon="el-icon-user"
              v-model="form.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              clearable
              show-password
              prefix-icon="el-icon-key"
              v-model="form.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" :loading="loading" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<style>
.el-main-form {
  text-align: center;
  padding: 32px 0;
  width: 384px;
  margin: 0 auto;
}
</style>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名称或邮箱地址不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      },
      loading:false
    };
  },

  methods: {
    onSubmit() {
      let self = this;
      self.$refs.form.validate(valid => {
        if (valid) {
          self.loading=true;
          self.$store.dispatch('login',self.form).then((response) => {
            self.$router.push('/');
          }).catch((error)=>{
            self.$message.error('无效的用户名称或密码');
            self.loading=false;
          })
        }
      })
    } 
  }
};
</script>