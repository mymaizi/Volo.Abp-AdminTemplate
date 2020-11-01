<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-button v-show="$allowVisible('AbpIdentity.Roles.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddRole">新角色</el-button>
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
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Roles.Update')" :command="{action:'update',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Roles.ManagePermissions')" :command="{action:'permis',row:scope.row}">权限</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('AbpIdentity.Roles.Delete')&&scope.row.name!='admin'" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
                <template #name>
                     <el-table-column label="角色名称">
                        <template v-slot="scope">
                            {{scope.row.name}}
                            <el-tag v-show="scope.row.isDefault" size="mini" type="success" effect="dark">
                                默认
                            </el-tag>
                            <el-tag v-show="scope.row.isPublic" size="mini" effect="dark">
                                公开
                            </el-tag>
                        </template>
                    </el-table-column>
                </template>
            </AppTable>
        </el-col>
    </el-row>
    <el-dialog @open="onRoleDialogOpen" :title="`${roleDialog.flag?'新角色':'编辑'}`" :visible.sync="roleDialog.visible">
         <el-form ref="roleDialogForm" :model="roleDialog.form">
                    <el-form-item prop="name" label="角色名称" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                        <el-input
                        placeholder="请输入角色名称"
                        clearable
                        v-model="roleDialog.form.name"
                        ></el-input>
                    </el-form-item>
                     <el-form-item prop="isDefault">
                         <el-checkbox v-model="roleDialog.form.isDefault">默认</el-checkbox>
                    </el-form-item>
                    <el-form-item prop="isPublic">
                         <el-checkbox v-model="roleDialog.form.isPublic">公开</el-checkbox>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="roleDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onRoleDialogSave" :loading="roleDialog.loading" icon="el-icon-check">保存</el-button>
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
        return {
            appTable:{
                url: "/api/identity/roles",
                allowMultiple:false,
                params:{maxResultCount:10},
                columns:[
                    { headerText: "角色名称", rowText: "name"}
                ]
            },
            roleDialog:{
                visible:false,
                flag:false,
                loading:false,
                form:{
                    name:"",
                    isPublic:false,
                    isDefault:false
                }
            },
            permisDialog:{
                visible:false,
                title:"",
                putItems:[],
                loading:false,
                providerKey:"",
                providerName:"R"
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
        onPermisDialogOpen(){
            let self=this;
            self.$nextTick(()=>{
                self.$refs.appPermis.reload();
            });
        },
        onRoleDialogSave(){
            let self = this;
            self.$refs.roleDialogForm.validate(valid => {
                if (valid) {
                self.roleDialog.loading=true;
                self.$http(`${self.roleDialog.flag?'/api/identity/roles':'/api/identity/roles/'+self.roleForm.id}`,{method:`${self.roleDialog.flag?'post':'put'}`,data:self.roleDialog.form}).then(function(response){
                    self.$toastr.success(`${self.roleDialog.flag?'新增':'编辑'}成功`);
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                }).then(function(){
                        Object.assign(self.roleDialog,{
                            visible:false,
                            loading:false
                        })
                })
                }
            })
        },
        onRoleDialogOpen(){
            let self=this;
            if(self.$refs.roleDialogForm){
                self.$refs.roleDialogForm.resetFields();
            }
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        onAddRole(){
            let self=this;
            Object.assign( self.roleDialog,{
                    visible:true,
                    flag:true
                });
        },
        appTableHandleCommand(command){
            let self=this;
            if(command.action=="update"){
               Object.assign( self.roleDialog,{
                    visible:true,
                    flag:false
                });
               self.$nextTick(function(){
                   Object.assign(self.roleDialog.form,command.row);
               })
            }else if(command.action=="delete"){
                 self.onDeleteRole(command.row.id);
            }else if(command.action=="permis"){
                self.permisDialog={
                    visible:true,
                    title:`权限 - ${command.row.name}`,
                    providerKey:command.row.name,
                    providerName:"R"
                }
            }
        },
        onDeleteRole(id){
            let self=this;
            self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/identity/roles/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                })
            });
        }
    }
}
</script>