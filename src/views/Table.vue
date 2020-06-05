<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-input @input="onSearch" v-model="appTable.params.filter" placeholder="搜索" clearable style="width:200px" size="medium" />
            <el-button v-show="$allowVisible('TableManagement.Tables.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddTable">新表</el-button>
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
                                    <el-dropdown-item v-show="$allowVisible('TableManagement.Tables.Update')" :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('TableManagement.Tables.ManageItem')" :command="{action:'manager',row:scope.row}">管理字段</el-dropdown-item>
                                    <el-dropdown-item v-show="$allowVisible('TableManagement.Tables.Delete')" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </template>
            </AppTable>
        </el-col>
    </el-row>
    <el-dialog @open="onTableDialogOpen" :title="`${tableDialog.flag?'新表':'编辑'}`" :visible.sync="tableDialog.visible">
         <el-form ref="tableForm" :model="tableForm" :rules="tableFormRoles">
                    <el-form-item prop="_name" label="表名称">
                        <el-input
                        placeholder="请输入表名称"
                        clearable
                        maxlength="20"
                        show-word-limit
                        v-model="tableForm._name"
                        >
                         <template slot="append">表前缀：Dynamic</template>
                        </el-input>
                    </el-form-item>
                     <el-form-item prop="description" label="描述">
                        <el-input
                        placeholder="请输入描述"
                        clearable
                        type="textarea"
                        maxlength="100"
                        show-word-limit
                        v-model="tableForm.description"
                        ></el-input>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="tableDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSaveTable" :loading="tableFormLoading" icon="el-icon-check">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog width="70%" @open="onTableItemDialogOpen" title="字段管理" :visible.sync="tableItemDialog.visible">
        <el-row>
            <el-col :span="24">
                <el-button v-show="$allowVisible('TableManagement.Tables.ManageItem.Create')" style="float:right" size="medium" type="primary" icon="el-icon-plus" @click="onAddTableItem">新列</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <AppTable ref="dialogAppTable" v-bind="dialogAppTable">
                    <template #fixed>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-dropdown @command="dialogAppTableHandleCommand" size="mini" split-button type="primary">
                                    操作
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-show="$allowVisible('TableManagement.Tables.ManageItem.Update')" :command="{action:'edit',row:scope.row}">编辑</el-dropdown-item>
                                        <el-dropdown-item v-show="$allowVisible('TableManagement.Tables.ManageItem.Delete')" :command="{action:'delete',row:scope.row}">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                    <template #allowEmpty>
                         <el-table-column label="允许为空">
                            <template v-slot="scope">
                                 <el-checkbox disabled v-model="scope.row.allowEmpty"></el-checkbox>
                            </template>
                        </el-table-column>
                    </template>
                </AppTable>
            </el-col>
        </el-row>
    </el-dialog>
        <el-dialog @open="onTableItemActionDialogOpen" :title="`${tableItemActionDialog.flag?'新列':'编辑'}`" :visible.sync="tableItemActionDialog.visible">
         <el-form ref="tableItemActionForm" :model="tableItemActionForm" :rules="tableItemActionFormRoles" label-width="80px">
                    <el-form-item label="列名称" required>
                            <el-col :span="11">
                            <el-form-item prop="name">
                                <el-input
                                placeholder="请输入列名称"
                                clearable
                                maxlength="20"
                                show-word-limit
                                v-model="tableItemActionForm.name"
                                >
                                </el-input>
                            </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align:center">-</el-col>
                            <el-col :span="11">
                            <el-form-item prop="allowEmpty">
                                <el-checkbox v-model="tableItemActionForm.allowEmpty">允许为空</el-checkbox>
                            </el-form-item>  
                            </el-col>
                    </el-form-item>
                    <el-form-item label="数据类型" required>
                            <el-col :span="12">
                                    <el-form-item prop="dataType">
                                        <el-select v-model="tableItemActionForm.dataType" placeholder="请选择">
                                            <el-option
                                            v-for="item in [{
                                            value: 'nvarchar',
                                            label: 'nvarchar'
                                            }]"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="dataTypeSize">
                                    <el-input v-model="tableItemActionForm.dataTypeSize"></el-input>
                                </el-form-item>
                            </el-col>
                    </el-form-item>
                    <el-form-item prop="formType" label="表单类型">
                        <el-select v-model="tableItemActionForm.formType" placeholder="请选择">
                            <el-option
                            v-for="item in  [{
                            value: 'text',
                            label: 'text'
                            }]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item prop="description" label="描述">
                        <el-input
                        placeholder="请输入描述"
                        clearable
                        type="textarea"
                        maxlength="100"
                        show-word-limit
                        v-model="tableItemActionForm.description"
                        ></el-input>
                    </el-form-item>
         </el-form>
        <div slot="footer">
            <el-button @click="tableItemActionDialog.visible=false">取 消</el-button>
            <el-button type="primary" @click="onSaveTableItemAction" :loading="tableItemActionFormLoading" icon="el-icon-check">保存</el-button>
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
.el-select-dropdown__item{
    height: 46px !important;
}
</style>
<script>
export default {
    data(){
        return {
            appTable:{
                url: "/api/myworld/tables",
                allowMultiple:false,
                params:{maxResultCount:10,filter:''},
                columns:[
                    { headerText: "表名称", rowText: "name"},
                    { headerText: "描述", rowText: "description"}
                ]
            },
            dialogAppTable:{
                url: "/api/myworld/tables/items",
                allowMultiple:false,
                allowInitRequest:false,
                params:{id:''},
                columns:[
                    { headerText: "列名称", rowText: "name"},
                    { headerText: "允许为空", rowText: "allowEmpty"},
                    { headerText: "数据类型", rowText: "dataType"},
                    { headerText: "表单类型", rowText: "formType"},
                    { headerText: "描述", rowText: "description"}
                ]
            },
            tableDialog:{
                visible:false,
                flag:false
            },
            tableForm:{
                name:"",
                description:"",
                _name:""
            },
            tableFormRoles:{
                    _name: [
                        { required: true, message: "表名称不能为空", trigger: "blur" },
                    ]
            },
            tableFormLoading:false,
            tableItemDialog:{
                visible:false,
                id:""
            },
            tableItemActionDialog:{
                visible:false,
                flag:false
            },
            tableItemActionForm:{
                name:"",
                description:"",
                formType:"",
                dataType:"",
                dataTypeSize:"",
                allowEmpty:true
            },
            tableItemActionFormLoading:false,
            tableItemActionFormRoles:{
                    name: [
                        { required: true, message: "列名称不能为空", trigger: "blur" },
                    ],
                     dataType: [
                        { required: true, message: "数据类型不能为空", trigger: "change" },
                    ],
                     formType: [
                        { required: true, message: "表单类型不能为空", trigger: "change" },
                    ]
            },
        }
    },
    watch:{
        "tableForm._name":function(v){
            this.tableForm.name=self._.startsWith(v,"Dynamic")?v:`Dynamic${v}`;
        },
        'tableItemActionForm.dataTypeSize':function(v){
            let self=this;
            if(v==""){
                self.tableItemActionForm.dataType=self._.replace(self.tableItemActionForm.dataType,/(?=\().*(?<=\))/,'');
            }else{
                let size=`(${v})`;
                self.tableItemActionForm.dataType=`${self.tableItemActionForm.dataType}${size}`
                let type=self._.replace(self.tableItemActionForm.dataType,/(?=\().*(?<=\))/,size)
                self.tableItemActionForm.dataType=type;
            }
        }
    },
    methods:{
        onSaveTable(){
            let self = this;
            self.$refs.tableForm.validate(valid => {
                if (valid) {
                self.tableFormLoading=true;
                self.$http(`${self.tableDialog.flag?'/api/myworld/tables':'/api/myworld/tables/'+self.tableForm.id}`,{method:`${self.tableDialog.flag?'post':'put'}`,data:self.tableForm}).then(function(response){
                    self.$toastr.success(`${self.tableDialog.flag?'新增':'编辑'}成功`);
                    self.tableDialog.visible=false;
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error(`${self.tableDialog.flag?'新增':'编辑'}失败`);
                }).then(function(){
                     self.tableFormLoading=false;
                })
                }
            })
        },
        onTableDialogOpen(){
            let self=this;
            if(self.$refs.tableForm){
                self.$refs.tableForm.resetFields();
            }
        },
        onTableItemDialogOpen(){
            let self=this;
            self.$nextTick(()=>{
                self.dialogAppTable.params.id=self.tableItemDialog.id;
                self.$refs.dialogAppTable.go();
            })
        },
        onTableItemActionDialogOpen(){
            let self=this;
            if(self.$refs.tableItemActionForm){
                self.$refs.tableItemActionForm.resetFields();
            }
        },
        onSearch(){
            this.$refs.appTable.go();
        },
        onAddTable(){
            let self=this;
            self.tableDialog={
                visible:true,
                flag:true
            }
        },
        onAddTableItem(){
            let self=this;
            self.tableItemActionDialog={
                visible:true,
                flag:true
            }
        },
        onSaveTableItemAction(){
            let self = this;
            self.$refs.tableItemActionForm.validate(valid => {
                if (valid) {
                self.tableItemActionFormLoading=true;
                self.$http(`${self.tableItemActionDialog.flag?'/api/myworld/tables/'+self.tableItemDialog.id:'/api/myworld/tables/'+self.tableItemDialog.id+'/'+self.tableItemActionForm.id}`,{method:`${self.tableItemActionDialog.flag?'post':'put'}`,data:self.tableItemActionForm}).then(function(response){
                    self.$toastr.success(`${self.tableItemActionDialog.flag?'新增':'编辑'}成功`);
                    self.tableItemActionDialog.visible=false;
                    self.$refs.dialogAppTable.go();
                }).catch(function(error){
                    self.$toastr.error(`${self.tableItemActionDialog.flag?'新增':'编辑'}失败`);
                }).then(function(){
                     self.tableItemActionFormLoading=false;
                })
                }
            })
        },
        appTableHandleCommand(command){
            let self=this;
            if(command.action=="edit"){
                self.tableDialog={
                    visible:true,
                    flag:false
                }
               self.$nextTick(function(){
                   Object.assign(self.tableForm,command.row);
                   self.tableForm._name=command.row.name;
               })
            }else if(command.action=="delete"){
                 self.onDeleteTable(command.row.id);
            }else if(command.action=="manager"){
                self.tableItemDialog={
                    id:command.row.id,
                    visible:true
                }
            }
        },
        dialogAppTableHandleCommand(command){
            let self=this;
            if(command.action=="edit"){
                self.tableItemActionDialog={
                    visible:true,
                    flag:false
                }
               self.$nextTick(function(){
                   Object.assign(self.tableItemActionForm,command.row);
               })
            }else if(command.action=="delete"){
                 self.onDeleteTableItem(command.row.id);
            }
        },
        onDeleteTable(id){
            let self=this;
            self.$confirm('此操作将永久删除该表, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/myworld/tables/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.onSearch();
                }).catch(function(error){
                    self.$toastr.error('删除失败');
                })
            });
        },
        onDeleteTableItem(id){
            let self=this;
            self.$confirm('此操作将永久删除该列, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.$http.delete(`/api/myworld/tables/${self.tableItemDialog.id}/${id}`).then(function(response){
                    self.$toastr.success('删除成功');
                    self.$refs.dialogAppTable.go();
                }).catch(function(error){
                    self.$toastr.error('删除失败');
                })
            });
        }
    }
}
</script>