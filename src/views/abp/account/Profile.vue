<template>
 <el-tabs tab-position="left" @tab-click="tabClick">
    <el-tab-pane label="修改密码">
        <span>修改密码</span>
        <el-divider/>
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRoles">
          <el-form-item prop="currentPassword" label="当前密码">
            <el-input
              placeholder="请输入当前密码"
              clearable
              show-password
              v-model="passwordForm.currentPassword"
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input
              placeholder="请输入新密码"
              clearable
              show-password
              v-model="passwordForm.newPassword"
            ></el-input>
          </el-form-item>
            <el-form-item prop="checkPassword" label="确认新密码">
            <el-input
              placeholder="请确认新密码"
              clearable
              show-password
              v-model="passwordForm.checkPassword"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  :loading="passwordFormLoading" type="primary" @click="onSavePassword" icon="el-icon-check">保存</el-button>
          </el-form-item>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="个人设置">
       <span>个人设置</span>
        <el-divider/>
        <el-form ref="personalForm" :model="personalForm" :rules="personalRoles">
          <el-form-item prop="userName" label="用户名称">
            <el-input
              placeholder="请输入用户名称"
              clearable
              v-model="personalForm.userName"
            ></el-input>
          </el-form-item>
          <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item prop="name" label="名">
              <el-input
                placeholder="请输入名"
                clearable
                v-model="personalForm.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="surname" label="姓">
              <el-input
                placeholder="请输入姓"
                clearable
                v-model="personalForm.surname"
              ></el-input>
            </el-form-item>
          </el-col>
          </el-row>
           <el-form-item prop="email" label="邮箱地址">
            <el-input
              placeholder="请输入邮箱地址"
              clearable
              v-model="personalForm.email"
            ></el-input>
          </el-form-item>
           <el-form-item prop="phoneNumber" label="手机号码">
            <el-input
              placeholder="请输入手机号码"
              clearable
              v-model="personalForm.phoneNumber"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  :loading="personalFormLoading" type="primary" @click="onSavePersonal" icon="el-icon-check">保存</el-button>
          </el-form-item>
        </el-form></el-tab-pane>
  </el-tabs>
   
</template>

<script>
export default {
 data() {
    return {
      passwordForm: {
       currentPassword: "",
       newPassword: "",
       checkPassword:""
      },
      passwordRoles: {
        currentPassword: [
          { required: true, message: "当前密码不能为空", trigger: "blur"},
          { pattern: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/,message: "密码应包括数字、大小写和特殊字符长度>=6位",trigger:"change"}
        ],
        newPassword: [
          { validator:(rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入新密码'));
            }else if(!/^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/.test(value)){
              callback(new Error('密码应包括数字、大小写和特殊字符长度>=6位'));
            } else {
              if (this.passwordForm.checkPassword !== '') {
                  this.$refs.passwordForm.validateField('checkPassword');
              }
              callback();
            }
        },required: true, trigger: ["blur","change"] }
        ],
        checkPassword: [
            {validator:  (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                }else if (value !== this.passwordForm.newPassword) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
            },required: true,  trigger: 'blur' }
          ],
      },
      passwordFormLoading:false,
      personalForm:{
        userName:"",
        name:"",
        surname:"",
        email:"",
        phoneNumber:""
      },
      personalRoles:{
         userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
           {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["change"]
          }
        ],
      },
      personalFormLoading:false
    };
  },
  methods: {
    onSavePassword() {
      let self = this;
      self.$refs.passwordForm.validate(valid => {
        if (valid) {
          let {checkPassword,...newForm}=self.passwordForm;
          self.passwordFormLoading=true;
          self.$http.post('/api/identity/my-profile/change-password',newForm).then(function(response){
            self.$toastr.success("修改成功");
            self.$refs.passwordForm.resetFields();
          }).catch(function(error){
            self.$toastr.error("修改失败")
          }).then(function(){
              self.passwordFormLoading=false;
          })
        }
      })
    },
    onSavePersonal(){
      let self = this;
      self.$refs.personalForm.validate(valid => {
        if (valid) {
          self.personalFormLoading=true;
          self.$http.put('/api/identity/my-profile',self.personalForm).then(function(response){
            self.$toastr.success("修改成功");
          }).catch(function(error){
            self.$toastr.error("修改失败")
          }).then(function(){
            self.personalFormLoading=false;
          })
        }
      })
    },
    getMyProfile(){
      let self = this;
      self.$http.get('/api/identity/my-profile').then(function(response){
           Object.assign(self.personalForm,response.data);
      })
    },
    tabClick(tab){
      if(tab.label=="个人设置"){
        this.$refs.personalForm.resetFields();
        this.getMyProfile();
      }else{
        this.$refs.passwordForm.resetFields();
      }
    }
  }
}
</script>