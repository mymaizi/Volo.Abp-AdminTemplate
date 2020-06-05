<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-input @input="onSearch" v-model="appTable.params.filter" placeholder="搜索" clearable style="width:200px" size="medium" />
            <el-button v-show="$allowVisible('AbpTenantManagement.Tenants.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddTenant">新租户</el-button>
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
                                    <el-dropdown-item v-show="$allowVisible('AbpTenantManagement.Tenants.Update')" :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpTenantManagement.Tenants.ManageConnectionStrings')" :command="{action:'conn',row:scope.row}">管理连接字符串</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpTenantManagement.Tenants.ManageFeatures')" :command="{action:'manager',row:scope.row}">管理功能</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpTenantManagement.Tenants.Delete')" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
            </AppTable>
        </el-col>
    </el-row>
    <el-dialog @open="onTenantDialogOpen" :title="`${tenantDialog.flag?'新租户':'编辑'}`" :visible.sync="tenantDialog.visible">
         <el-form ref="tenantForm" :model="tenantForm" :rules="tenantRoles">
                    <el-form-item prop="name" label="租户名称">
                        <el-input
                        placeholder="请输入租户名称"
                        clearable
                        v-model="tenantForm.name"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-show="tenantDialog.flag" prop="adminEmailAddress" label="管理员邮件地址">
                        <el-input
                        placeholder="请输入管理员邮件地址"
                        clearable
                        v-model="tenantForm.adminEmailAddress"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-show="tenantDialog.flag" prop="adminPassword" label="管理员密码">
                        <el-input
                        placeholder="请输入管理密码"
                        clearable
                        show-password
                        v-model="tenantForm.adminPassword"
                        ></el-input>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="tenantDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSaveTenant" :loading="tenantFormLoading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog  title="连接字符串" :visible.sync="tenantConnDialog.visible">
        <el-form>
            <el-checkbox v-model="tenantConnDialog.isShareConn">使用共享数据库</el-checkbox>
            <el-form-item v-show="!tenantConnDialog.isShareConn"  label="默认连接字符串">
                    <el-input
                    placeholder="请输入连接字符串"
                    clearable
                    v-model="tenantConnDialog.defaultConnectionString"
                    ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="tenantConnDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSaveTenantConn" :loading="tenantConnDialog.loading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog  title="功能" :visible.sync="tenantManagerDialog.visible">
    </el-dialog>
</div>
</template>
<style scoped>
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
}
</style>>
<script>
export default {
    data(){
        return {
            appTable:{
                url: "/api/multi-tenancy/tenants",
                allowMultiple:false,
                params:{maxResultCount:10,filter:''},
                columns:[
                    { headerText: "租户名称", rowText: "name"}
                ]
            },
            tenantDialog:{
                visible:false,
                flag:false
            },
            tenantForm:{
                name:"",
                adminEmailAddress:"",
                adminPassword:""
            },
            tenantRoles:{
                    name: [
                        { required: true, message: "租户名称不能为空", trigger: "blur" },
                    ],
                    adminEmailAddress: [
                        { required: true, message: "邮箱地址不能为空", trigger: "blur" },
                        { type: "email",message: "请输入正确的邮箱地址",trigger: "change"}
                    ],
                    adminPassword: [
                        { required: true,message: "密码不能为空", trigger: "blur"},
                        { pattern: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/,message: "密码应包括数字、大小写和特殊字符长度>=6位",trigger:"change"}
                    ]
            },
            tenantFormLoading:false,
            tenantConnDialog:{
                visible:false,
                id:"",
                defaultConnectionString:"",
                isShareConn:true,
                loading:false
            },
            tenantManagerDialog:{
                visible:false
            }
        }
    },
    methods:{
        onSaveTenantConn(){
            let self=this;
            let flag=self.tenantConnDialog.defaultConnectionString!=""&&!self.tenantConnDialog.isShareConn;
            let id=self.tenantConnDialog.id;
            let conn=self.tenantConnDialog.defaultConnectionString;
            self.$http(flag?`/api/multi-tenancy/tenants/${id}/default-connection-string?defaultConnectionString=${conn}`:`/api/multi-tenancy/tenants/${id}/default-connection-string`,{method:`${flag?'put':'delete'}`}).then(function(response){
                self.$toastr.success('操作成功');
            }).catch(function(error){
                self.$toastr.error('操作失败');
            }).then(function(){
                self.tenantConnDialog.visible=false;
            })
        },
        onSaveTenant(){
            let self = this;
            self.$refs.tenantForm.validate(valid => {
                if (valid) {
                self.tenantFormLoading=true;
                self.$http(`${self.tenantDialog.flag?'/api/multi-tenancy/tenants':'/api/multi-tenancy/tenants/'+self.tenantForm.id}`,{method:`${self.tenantDialog.flag?'post':'put'}`,data:self.tenantForm}).then(function(response){
                    self.$toastr.success(`${self.tenantDialog.flag?'新增':'编辑'}成功`);
                    self.tenantDialog.visible=false;
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(`${self.tenantDialog.flag?'新增':'编辑'}失败`);
                }).then(function(){
                     self.tenantFormLoading=false;
                })
                }
            })
        },
        onTenantDialogOpen(){
            let self=this;
            if(self.$refs.tenantForm){
                self.$refs.tenantForm.resetFields();
            }
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        onAddTenant(){
            let self=this;
            self.tenantDialog={
                visible:true,
                flag:true
            }
            self.$refs.tenantForm.rules.adminEmailAddress[0].required=true;
            self.$refs.tenantForm.rules.adminPassword[0].required=true;
        },
        appTableHandleCommand(command){
            let self=this;
            if(command.action=="edit"){
                self.tenantDialog={
                    visible:true,
                    flag:false
                }
               self.$nextTick(function(){
                   Object.assign(self.tenantForm,command.row);
                   self.$refs.tenantForm.rules.adminEmailAddress[0].required=false;
                   self.$refs.tenantForm.rules.adminPassword[0].required=false;
               })
            }else if(command.action=="delete"){
                 self.onDeleteTenant(command.row.id);
            }else if(command.action=="conn"){
                self.$http.get(`/api/multi-tenancy/tenants/${command.row.id}/default-connection-string`).then(function(response){
                    self.tenantConnDialog={
                            visible:true,
                            id:command.row.id,
                            isShareConn:response.data=="",
                            defaultConnectionString:response.data
                        }
                })
            }else if(command.action=="manager"){
                self.tenantManagerDialog.visible=true;
                self.$http.get('/api/abp/features',{
                    params:{
                        providerKey: command.row.id,
                        providerName: "T"
                    }
                }).then(function(response){
                   
                })
            }
        },
        onDeleteTenant(id){
            let self=this;
            self.$confirm('此操作将永久删除该租户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/multi-tenancy/tenants/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error('删除失败');
                })
            });
        }
    }
}
</script>