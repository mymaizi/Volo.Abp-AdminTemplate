<template>
  <div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="items"
      @selection-change="onSelectionChange"
    >
      <template v-if="allowMultiple">
        <el-table-column type="selection"/>
      </template>
      <template v-for="(item,i) in tableColumns">
        <slot :name="item.rowText" >
          <el-table-column  :label="item.headerText" :key="i" :sortable="item.sortable" :prop="item.rowText"/>
        </slot>
      </template>
      <slot name="fixed" />
    </el-table>
    <el-pagination
      @current-change="go"
      :page-size="size"
      :hide-on-single-page="true"
      layout="prev, pager, next, jumper"
      :total="totalCount"
    />
  </div>
</template>
<style>
.el-table__empty-block{
  width:100% !important;
}
</style>
<script>
export default {
  name: "AppTable",
  props: {
    //请求地址，如果请求返回数据中包括columns字段则可忽略prop属性columns,反之则需要外部传入
    url: {
      type: String,
      required: true,
      validator: function(value) {
        return value != "";
      }
    },
    //请求参数
    params: {
      type: Object,
      required: false
    },
    //数据绑定列===>[{ headerText: "you header text", rowText: "you data field",sortable:"you field sortable to true or false" }]
    columns: {
      type: Array,
      required: false
    },
    //分页大小
    size: {
      type: Number,
      required: false,
      default: 10
    },
    //允许多选
    allowMultiple: {
      type: Boolean,
      required: false,
      default: true
    },
    //v-model
    value: {
      type: Array,
      default: ()=>{}
    },
    allowInitRequest:{
       type: Boolean,
       required: false,
       default: true
    }
  },
  data() {
    return {
      loading:false,
      items: [], //数据项
      totalCount: 0, //总数
      tableColumns: this.columns //用于控制显示列是通过table属性传入还是通过后端请求获取
    };
  },
  mounted() {
    if(this.allowInitRequest){
      this.go();
    }
  },
  methods: {
    //跳转页
    go(page = 1) {
      let self = this;
      self.loading=true;
      let _params = {};
      _params["page"] = page;
      _params["size"] = self.size;
      Object.assign(_params, self.params);
      self.$http.get(self.url, { params: _params }).then(response => {
        let data = response.data;
        if (data.columns != undefined) {
          self.tableColumns = data.columns;
        } else if (self.tableColumns == undefined) {
          console.log(
            "初始化表格失败，请检查是否设置columns参数或者保证columns从后端返回！"
          );
        }
        self.items = data.items;
        self.totalCount = data.totalCount;
      }).then(function(){
        self.loading=false;
      });
    },
    onSelectionChange(val) {
      this.$emit("input", val);
    }
  }
};
</script>