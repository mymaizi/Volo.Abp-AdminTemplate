<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-input @input="onSearch" v-model="appTable.params.filter" placeholder="搜索" clearable style="width:200px" size="medium" />
            <el-button v-show="$allowVisible('AbpIdentity.Users.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddUser">新用户</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <AppTable ref="appTable" v-bind="appTable">
                <template #fixed>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-dropdown @command="appTableHandleCommand" size="mini" split-button type="primary">
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Users.Update')" :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Users.ManagePermissions')" :command="{action:'permis',row:scope.row}">权限</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Users.Delete')&&scope.row.userName!='admin'" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
            </AppTable>
        </el-col>
    </el-row>
    <el-dialog @open="onUserDialogOpen" :title="`${userDialog.flag?'新用户':'编辑'}`" :visible.sync="userDialog.visible">
       <el-tabs v-model="activeName">
            <el-tab-pane label="用户信息" name="user">
                 <el-form ref="userDialogForm" :model="userDialog.form" :rules="userDialog.rule">
                    <el-form-item prop="userName" label="用户名称">
                        <el-input
                        placeholder="请输入用户名称"
                        clearable
                        v-model="userDialog.form.userName"
                        ></el-input>
                    </el-form-item>
                    <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="name" label="名">
                        <el-input
                            placeholder="请输入名"
                            clearable
                            v-model="userDialog.form.name"
                        ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="surname" label="姓">
                        <el-input
                            placeholder="请输入姓"
                            clearable
                            v-model="userDialog.form.surname"
                        ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-row>
                     <el-form-item ref="userDialogFormPassword" prop="password" label="密码">
                        <el-input
                        placeholder="请输入密码"
                        clearable
                        show-password
                        v-model="userDialog.form.password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="邮箱地址">
                        <el-input
                        placeholder="请输入邮箱地址"
                        clearable
                        v-model="userDialog.form.email"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="phoneNumber" label="手机号码">
                        <el-input
                        placeholder="请输入手机号码"
                        clearable
                        v-model="userDialog.form.phoneNumber"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="lockoutEnabled">
                         <el-checkbox v-model="userDialog.form.lockoutEnabled">登录失败,账户被锁定</el-checkbox>
                    </el-form-item>
                    <el-form-item prop="twoFactorEnabled">
                         <el-checkbox v-model="userDialog.form.twoFactorEnabled">二次认证</el-checkbox>
                    </el-form-item>
                    </el-form>
            </el-tab-pane>
            <el-tab-pane label="角色" name="role">
                <el-checkbox-group v-model="userDialog.form.roleNames">
                    <el-checkbox :key="item.id" :label="item.name" v-for="item in allRoles"></el-checkbox>
                </el-checkbox-group>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <el-button @click="userDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onUserDialogSave" :loading="userDialog.loading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog width="76%" destroy-on-close @open="onPermisDialogOpen" :title="permisDialog.title" :visible.sync="permisDialog.visible">
        <AppPermis v-model="permisDialog.putItems" :providerName="permisDialog.providerName" :providerKey="permisDialog.providerKey"  ref="appPermis"/>
        <div slot="footer">
            <el-button @click="permisDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onPermisDialogSave" :loading="permisDialog.loading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>
<style lang="stylus" scoped>
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
}
</style>>
<script>
import AppPermis from "@/components/AppPermis.vue"
export default {
    components:{
        AppPermis
    },
    data(){
        return{
            appTable: {
                url: "/api/identity/users",
                allowMultiple:false,
                params:{maxResultCount:10,filter:""},
                columns:[
                    { headerText: "用户名称", rowText: "userName"},
                    { headerText: "邮箱地址", rowText: "email"},
                    { headerText: "手机号", rowText: "phoneNumber"}
                ]
            },
            userDialog:{
                flag:true,
                visible:false,
                loading:false,
                form:{
                    userName:"",
                    name:"",
                    surname:"",
                    password:"",
                    email:"",
                    phoneNumber:"",
                    twoFactorEnabled:true,
                    lockoutEnabled:true,
                    roleNames:[]
                },
                rule:{
                    userName: [
                        { required: true, message: "不能为空", trigger: "blur" },
                    ],
                    email: [
                        { required: true, message: "不能为空", trigger: "blur" },
                        { type: "email",message: "请输入正确的邮箱地址",trigger: "change"}
                    ],
                    password: [
                        { required: true,message: "不能为空", trigger: "blur"},
                        { pattern: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/,message: "密码应包括数字、大小写和特殊字符长度>=6位",trigger:"change"}
                    ]
                }
            },
            activeName: 'user',
            allRoles:[],
            permisDialog:{
                visible:false,
                title:"",
                putItems:[],
                loading:false,
                providerKey:"",
                providerName:"U"
            }
        }
    },
    methods:{
        onPermisDialogSave(){
            let self=this;
            let permis=self.permisDialog;
            if(permis.putItems&&permis.putItems.length>0){
                permis.loading=true;
                self.$http.put('/api/abp/permissions',{permissions:permis.putItems},{
                params:{
                    providerKey:permis.providerKey,
                    providerName:permis.providerName
                }}).then(function(response){
                    self.$toastr.success('操作成功');
                    self.onSearch();
                }).then(function(){
                    permis.loading=false;
                });
            }
            permis.visible=false;
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        appTableHandleCommand(command) {
            let self=this;
            if(command.action=="update"){
                Object.assign(self.userDialog,{
                    visible:true,
                    flag:false
                })
               self.$nextTick(function(){
                   Object.assign(self.userDialog.form,command.row);
                   self.$refs.userDialogFormPassword.rules.password[0].required=false;
               })
            }else if(command.action=="delete"){
                 self.onDeleteUser(command.row.id);
            }else if(command.action=="permis"){
                self.permisDialog={
                    visible:true,
                    title:`权限 - ${command.row.userName}`,
                    providerKey:command.row.id,
                    providerName:"U"
                }
            }
        },
        onUserDialogOpen(){
            let self=this;
            if(self.$refs.userDialogForm){
                self.$refs.userDialogForm.resetFields();
                self.userDialog.form.roleNames=[];
                self.$refs.userDialogFormPassword.rules.password[0].required=true;
            }
            self.activeName='user';
            self.getAllRoles();
        },
        onAddUser(){
            let self=this;
           Object.assign( self.userDialog,{
                visible:true,
                flag:true
            })
        },
        onUserDialogSave(){
            let self = this;
            self.$refs.userDialogForm.validate(valid => {
                if (valid) {
                self.userDialog.loading=true;
                self.$http(`${self.userDialog.flag?'/api/identity/users':'/api/identity/users/'+self.userDialog.form.id}`,{method:`${self.userDialog.flag?'post':'put'}`,data:self.userDialog.form}).then(function(response){
                    self.$toastr.success(`${self.userDialog.flag?'新增':'编辑'}成功`);
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                }).then(function(){
                    Object.assign(self.userDialog,{
                        loading:false,
                        visible:false
                        
                    })
                })
                }
            })
        },
        getAllRoles(){
            let self=this;
            self.$http.get('/api/identity/roles/all').then(function(response){
                self.allRoles=response.data.items;
            })
            if(!self.userDialog.flag){
                self.$http.get(`/api/identity/users/${self.$store.state.appConfigs.currentUser.id}/roles`).then(function(response){
                  self._.forEach(response.data.items,function(item){
                      self.userDialog.form.roleNames.push(item.name);
                  })
                })
            }            
        },
        onDeleteUser(id){
            let self=this;
            self.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/identity/users/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                })
            });
        },
        onPermisDialogOpen(){
            let self=this;
            self.$nextTick().then(function(){
                self.$refs.appPermis.reload();
            })
        }
    }
}
</script>