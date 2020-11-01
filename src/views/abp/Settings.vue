<template>
  <el-tabs tab-position="left" @tab-click="tabClick">
    <el-tab-pane label="身份标识管理">
      <span style="font-weight: bold; font-size: 20px">身份标识管理</span>
      <el-divider />
      <el-form ref="identityForm" :model="identityForm">
        <div class="el-form-title">
          <span>密码设置</span>
        </div>
        <el-form-item>
          <label>要求长度</label>
          <el-input
            type="number"
            v-model="identityForm.password.requiredLength"
          >
          </el-input>
          <small>密码的最小长度.</small>
        </el-form-item>
        <el-form-item>
          <label>要求唯一字符数量</label>
          <el-input
            type="number"
            v-model="identityForm.password.requiredUniqueChars"
          >
          </el-input>
          <small>密码必须包含唯一字符的数量.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="identityForm.password.requiredUniqueChars">
            <label class="el-form-checkbox-label">要求非字母数字</label>
          </el-checkbox>
          <small>密码是否必须包含非字母数字.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="identityForm.password.requireNonAlphanumeric">
            <label class="el-form-checkbox-label">要求小写字母</label>
          </el-checkbox>
          <small>密码是否必须包含小写字母.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="identityForm.password.requireUppercase">
            <label class="el-form-checkbox-label"
              >要求大写字母</label
            ></el-checkbox
          >
          <small>密码是否必须包含大写字母.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="identityForm.password.requireDigit">
            <label class="el-form-checkbox-label">要求数字</label></el-checkbox
          >
          <small>密码是否必须包含数字.</small>
        </el-form-item>
        <div class="el-form-title">
          <span>锁定设置</span>
        </div>
        <el-form-item>
          <el-checkbox v-model="identityForm.lockout.allowedForNewUsers">
            <label class="el-form-checkbox-label"
              >允许新用户</label
            ></el-checkbox
          >
          <small>允许新用户被锁定.</small>
        </el-form-item>
        <el-form-item>
          <label>锁定时间(秒)</label>
          <el-input
            type="number"
            v-model="identityForm.lockout.lockoutDuration"
          >
          </el-input>
          <small>当锁定发生时用户被的锁定的时间(秒).</small>
        </el-form-item>
        <el-form-item>
          <label>最大失败访问尝试次数</label>
          <el-input
            type="number"
            v-model="identityForm.lockout.maxFailedAccessAttempts"
          >
          </el-input>
          <small>如果启用锁定, 当用户被锁定前失败的访问尝试次数.</small>
        </el-form-item>
        <div class="el-form-title"><span>登录设置</span></div>
        <el-form-item>
          <el-checkbox v-model="identityForm.signIn.requireConfirmedEmail">
            <label class="el-form-checkbox-label">要求验证的电子邮箱</label>
          </el-checkbox>
          <small>登录时是否需要验证的电子邮箱.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="identityForm.signIn.requireConfirmedPhoneNumber"
          >
            <label class="el-form-checkbox-label"
              >允许用户确认他们的电话号码</label
            >
          </el-checkbox>
          <small>电话号码是否能被用户确认.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="identityForm.signIn.enablePhoneNumberConfirmation"
          >
            <label class="el-form-checkbox-label">要求验证的手机号码</label>
          </el-checkbox>
          <small>登录时是否需要验证的手机号码.</small>
        </el-form-item>
        <div class="el-form-title"><span>用户设置</span></div>
        <el-form-item>
          <el-checkbox v-model="identityForm.user.isEmailUpdateEnabled">
            <label class="el-form-checkbox-label">启用电子邮箱更新</label>
          </el-checkbox>
          <small>是否允许用户更新电子邮箱.</small>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="identityForm.user.isUserNameUpdateEnabled">
            <label class="el-form-checkbox-label">启用用户名更新</label>
          </el-checkbox>
          <small>是否允许用户更新用户名.</small>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="settingsFormLoading"
            type="primary"
            @click="onSaveSettings"
            icon="el-icon-check"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="帐户">
      <span>帐户</span>
      <el-divider />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      settingsFormLoading: false,
      identityForm: {
        lockout: {
          allowedForNewUsers: "",
          lockoutDuration: "",
          maxFailedAccessAttempts: "",
        },
        password: {
          requireDigit: "",
          requireLowercase: "",
          requireNonAlphanumeric: "",
          requireUppercase: "",
          requiredLength: "",
          requiredUniqueChars: "",
        },
        signIn: {
          enablePhoneNumberConfirmation: "",
          requireConfirmedEmail: "",
          requireConfirmedPhoneNumber: "",
        },
        user: {
          isEmailUpdateEnabled: "",
          isUserNameUpdateEnabled: "",
        },
      },
    };
  },
  methods: {
    onSaveSettings() {
      let self = this;
      self.settingsFormLoading = true;
      self.$http
        .put("/api/identity/settings", self.identityForm)
        .then(function (response) {
          self.$toastr.success("修改成功");
        })
        .catch(function (error) {
          self.$toastr.error("修改失败");
        })
        .then(function () {
          self.settingsFormLoading = false;
        });
    },
    getSettings() {
      let self = this;
      self.$http.get("/api/identity/settings").then(function (response) {
        Object.assign(self.identityForm, response.data);
      });
    },
    tabClick(tab) {
      if (tab.label == "身份标识管理") {
        this.getSettings();
      } else {
      }
    },
  },
  mounted() {
    this.tabClick({ label: "身份标识管理" });
  },
};
</script>
<style scoped>
small {
  line-height: normal;
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
}
.el-form-item {
  margin-bottom: 0;
}
.el-form-item label {
  display: block;
  line-height: 2rem;
}
.el-form-title {
  margin-top: 40px;
}
.el-form-title span {
  font-weight: bold;
}
.el-form-checkbox-label {
  color: black;
}
</style>
<style lang="stylus" scoped>
.el-form-item {
  &:last-child {
    margin-top: 40px;
  }
}

.el-form-title {
  &:first-child {
    margin-top: 0px;
  }
}
</style>