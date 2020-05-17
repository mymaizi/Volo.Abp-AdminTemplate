<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-button style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddRole">新角色</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <AppTable ref="appTable" v-bind="appTable">
                <template #fixed>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-dropdown @command="handleCommand" size="mini" split-button type="primary">
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item :command="{action:'permis',row:scope.row}">权限</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.name!='admin'" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
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
         <el-form ref="roleForm" :model="roleForm">
                    <el-form-item prop="name" label="角色名称" :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]">
                        <el-input
                        placeholder="请输入角色名称"
                        clearable
                        v-model="roleForm.name"
                        ></el-input>
                    </el-form-item>
                     <el-form-item prop="isDefault">
                         <el-checkbox v-model="roleForm.isDefault">默认</el-checkbox>
                    </el-form-item>
                    <el-form-item prop="isPublic">
                         <el-checkbox v-model="roleForm.isPublic">公开</el-checkbox>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="roleDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSaveRole" :loading="roleFormLoading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
     <el-dialog width="76%" destroy-on-close @open="onPermisDialogOpen" :title="permisDialog.title" :visible.sync="permisDialog.visible">
        <AppPermis v-model="permisDialog.putItems" :providerName="permisDialog.providerName" :providerKey="permisDialog.providerKey" :isAdmin="permisDialog.isAdmin" ref="appPermis"/>
        <div slot="footer">
            <el-button @click="permisDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSavePermis" :loading="permisDialog.loading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>
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
                flag:false
            },
            roleForm:{
                name:"",
                isPublic:false,
                isDefault:false
            },
            roleFormLoading:false,
            permisDialog:{
                visible:false,
                title:"",
                putItems:[],
                loading:false,

                providerKey:"",
                providerName:"R",
                isAdmin:false
            }
        }
    },
    methods:{
         onSavePermis(){
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
            self.$nextTick().then(function(){
                self.$refs.appPermis.reload();
            })
        },
        onSaveRole(){
            let self = this;
            self.$refs.roleForm.validate(valid => {
                if (valid) {
                self.roleFormLoading=true;
                self.$http(`${self.roleDialog.flag?'/api/identity/roles':'/api/identity/roles/'+self.roleForm.id}`,{method:`${self.roleDialog.flag?'post':'put'}`,data:self.roleForm}).then(function(response){
                    self.$toastr.success(`${self.roleDialog.flag?'新增':'编辑'}成功`);
                    self.roleDialog.visible=false;
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(`${self.roleDialog.flag?'新增':'编辑'}失败`);
                }).then(function(){
                     self.roleFormLoading=false;
                })
                }
            })
        },
        onRoleDialogOpen(){
            let self=this;
            if(self.$refs.roleForm){
                self.$refs.roleForm.resetFields();
            }
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        onAddRole(){
            let self=this;
            self.roleDialog={
                visible:true,
                flag:true
            }
        },
        handleCommand(command){
            let self=this;
            if(command.action=="edit"){
                self.roleDialog={
                    visible:true,
                    flag:false
                }
               self.$nextTick(function(){
                   Object.assign(self.roleForm,command.row);
               })
            }else if(command.action=="delete"){
                 self.onDeleteRole(command.row.id);
            }else if(command.action=="permis"){
                self.permisDialog={
                    visible:true,
                    title:`权限 - ${command.row.name}`,

                    providerKey:command.row.name,
                    providerName:"R",
                    isAdmin:command.row.name=="admin"
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
                    self.$toastr.error('删除失败');
                })
            });
        }
    }
}
</script>