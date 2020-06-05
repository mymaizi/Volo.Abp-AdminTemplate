<template>
  <div>
    <el-row>
        <el-col :span="24">
            <el-input @input="onSearch" v-model="appTable.params.filter" placeholder="搜索" clearable style="width:200px" size="medium" />
            <el-button v-show="$allowVisible('MenuManagement.Menus.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAdd">新菜单</el-button>
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
                                    <el-dropdown-item v-show="$allowVisible('MenuManagement.Menus.Update')" :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('MenuManagement.Menus.Delete')" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
            </AppTable>
        </el-col>
    </el-row>
    <el-dialog @open="onMenuDialogOpen" :title="`${menuDialog.flag?'新菜单':'编辑'}`" :visible.sync="menuDialog.visible">
         <el-form ref="menuDialogForm" :model="menuDialog.form" :rules="menuDialog.roles">
                    <el-form-item prop="displayName" label="菜单名称">
                        <el-input
                        placeholder="请输入菜单名称"
                        clearable
                        v-model="menuDialog.form.displayName">
                        </el-input>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="menuDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onMenuDialogSave" :loading="menuDialog.loading" icon="el-icon-check">保存</el-button>
        </div>
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
</style>
<script>
export default {
    data(){
        return{
            appTable:{
                url: "/api/myworld/menus",
                allowMultiple:false,
                params:{maxResultCount:10,filter:''},
                columns:[
                    { headerText: "菜单名称", rowText: "displayName"}
                ]
            },
            menuDialog:{
                visible:false,
                flag:false,
                loading:false,
                form:{
                    displayName:""
                },
                roles:{
                    displayName:[
                        { required: true, message: "不能为空", trigger: "blur" },
                    ]
                }
            }
        }
    },
    methods:{
        appTableHandleCommand(command){
            let self=this;
            switch(command.action){
                case "edit":
                    Object.assign(self.menuDialog,{
                        visible:true,
                        flag:false,
                        form:command.row
                    });
                break;
                case "delete":
                    self.onDelete(command.row.id)
                break;
            }
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        onAdd(){
            Object.assign(this.menuDialog,{visible:true,flag:true});
        },
        onDelete(id){
            let self=this;
            self.$confirm('此操作将永久删除该菜单以及子菜单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/myworld/menus/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                })
            });
        },
        onMenuDialogSave(){
            let self = this;
            self.$refs.menuDialogForm.validate(valid => {
                if (valid) {
                self.menuDialog.loading=true;
                self.$http(`${self.menuDialog.flag?'/api/myworld/menus':'/api/myworld/menus/'+self.menuDialog.form.id}`,{method:`${self.menuDialog.flag?'post':'put'}`,data:self.menuDialog.form}).then(function(response){
                    self.$toastr.success(`${self.menuDialog.flag?'新增':'编辑'}成功`);
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(error.response.data.error.message);
                }).then(function(){
                     Object.assign(self.menuDialog,{
                         visible:false,
                         loading:false
                     });
                })
                }
            })
        },
        onMenuDialogOpen(){
            let self=this;
            if(self.$refs.menuDialogForm){
                self.$refs.menuDialogForm.resetFields();
            }
        }
    }
}
</script>