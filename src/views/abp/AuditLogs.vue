<template>
  <el-tabs>
    <el-tab-pane label="审计日志">
      <el-card>
        <el-form :inline="true" label-position="top" class="al-form">
          <el-form-item label="用户名">
            <el-input v-model="appTable.params.userName"></el-input>
          </el-form-item>
          <el-form-item label="Url过滤">
            <el-input v-model="appTable.params.url"></el-input>
          </el-form-item>
          <el-form-item label="最小持续时间">
            <el-input
              type="number"
              v-model="appTable.params.minExecutionDuration"
            ></el-input>
          </el-form-item>
          <el-form-item label="最大持续时间">
            <el-input
              type="number"
              v-model="appTable.params.maxExecutionDuration"
            ></el-input>
          </el-form-item>
          <el-form-item label="Http方法">
            <el-select v-model="appTable.params.httpMethod">
              <el-option value="" label=""></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="HEAD" value="HEAD"></el-option>
              <el-option label="CONNECT" value="CONNECT"></el-option>
              <el-option label="OPTIONS" value="OPTIONS"></el-option>
              <el-option label="TRACE" value="TRACE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Http状态码">
            <el-select v-model="appTable.params.httpStatusCode">
              <el-option value="" label=""></el-option>
              <el-option
                value="101"
                label="101 - Switching Protocols"
              ></el-option>
              <el-option value="102" label="102 - Processing"></el-option>
              <el-option value="103" label="103 - Early Hints"></el-option>
              <el-option value="200" label="200 - OK"></el-option>
              <el-option value="201" label="201 - Created"></el-option>
              <el-option value="202" label="202 - Accepted"></el-option>
              <el-option
                value="203"
                label="203 - Non-authoritative Information"
              ></el-option>
              <el-option value="204" label="204 - No Content"></el-option>
              <el-option value="205" label="205 - Reset Content"></el-option>
              <el-option value="206" label="206 - Partial Content"></el-option>
              <el-option value="100" label="100 - Continue"></el-option>
              <el-option value="207" label="207 - Multi-Status"></el-option>
              <el-option
                value="208"
                label="208 - Already Registered"
              ></el-option>
              <el-option value="226" label="226 - IM Used"></el-option>
              <el-option value="300" label="300 - Multiple Choices"></el-option>
              <el-option
                value="301"
                label="301 - Moved Permanently"
              ></el-option>
              <el-option value="302" label="302 - Found"></el-option>
              <el-option value="303" label="303 - See Other"></el-option>
              <el-option value="304" label="304 - Not Modified"></el-option>
              <el-option value="305" label="305 - Use Proxy"></el-option>
              <el-option value="306" label="306 - Switch Proxy"></el-option>
              <el-option
                value="307"
                label="307 - Temporary Redirect"
              ></el-option>
              <el-option
                value="308"
                label="308 - Permanent Redirect"
              ></el-option>
              <el-option value="400" label="400 - Bad Request"></el-option>
              <el-option value="401" label="401 - Unauthorized"></el-option>
              <el-option value="402" label="402 - Payment Required"></el-option>
              <el-option value="403" label="403 - Forbidden"></el-option>
              <el-option value="404" label="404 - Not Found"></el-option>
              <el-option
                value="405"
                label="405 - Method Not Allowed"
              ></el-option>
              <el-option value="406" label="406 - Not Acceptable"></el-option>
              <el-option
                value="407"
                label="407 - Proxy Authentication Required"
              ></el-option>
              <el-option value="408" label="408 - Request Timeout"></el-option>
              <el-option value="409" label="409 - Conflict"></el-option>
              <el-option value="410" label="410 - Gone"></el-option>
              <el-option value="411" label="411 - Length Required"></el-option>
              <el-option
                value="412"
                label="412 - Precondition Failed"
              ></el-option>
              <el-option
                value="413"
                label="413 - Payload Too Large"
              ></el-option>
              <el-option
                value="414"
                label="414 - Request-URI Too Long"
              ></el-option>
              <el-option
                value="415"
                label="415 - Unsupported Media Type"
              ></el-option>
              <el-option
                value="416"
                label="416 - Requested Range Not Satisfiable"
              ></el-option>
              <el-option
                value="417"
                label="417 - Expectation Failed"
              ></el-option>
              <el-option
                value="421"
                label="421 - Misdirected Request"
              ></el-option>
              <el-option value="423" label="423 - Locked"></el-option>
              <el-option
                value="424"
                label="424 - Failed Dependency"
              ></el-option>
              <el-option value="426" label="426 - Upgrade Required"></el-option>
              <el-option
                value="428"
                label="428 - Precondition Required"
              ></el-option>
              <el-option
                value="429"
                label="429 - Too Many Requests"
              ></el-option>
              <el-option
                value="431"
                label="431 - Request Header Fields Too Large"
              ></el-option>
              <el-option
                value="451"
                label="451 - Unavailable For Legal Reasons"
              ></el-option>
              <el-option
                value="500"
                label="500 - Internal Server Error"
              ></el-option>
              <el-option value="501" label="501 - Not Implemented"></el-option>
              <el-option value="502" label="502 - Bad Gateway"></el-option>
              <el-option
                value="503"
                label="503 - Service Unavailable"
              ></el-option>
              <el-option value="504" label="504 - Gateway Timeout"></el-option>
              <el-option
                value="505"
                label="505 - HTTP Version Not Supported"
              ></el-option>
              <el-option
                value="506"
                label="506 - Variant Also Negotiates"
              ></el-option>
              <el-option
                value="507"
                label="507 - Insufficient Storage"
              ></el-option>
              <el-option value="508" label="508 - Loop Detected"></el-option>
              <el-option value="510" label="510 - Not Extended"></el-option>
              <el-option
                value="511"
                label="511 - Network Authentication Required"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" class="al-form-item">
            <el-input v-model="appTable.params.applicationName"></el-input>
          </el-form-item>
          <el-form-item label="关联Id" class="al-form-item">
            <el-input v-model="appTable.params.correlationId"></el-input>
          </el-form-item>
          <el-form-item label="存在异常" class="al-form-item">
            <el-select v-model="appTable.params.hasException">
              <el-option value="" label=""></el-option>
              <el-option label="Yes" value="true"></el-option>
              <el-option label="No" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="al-form-item-button">
            <el-button type="primary" style="width: 250px" @click="onSubmit"
              >刷新</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <el-divider></el-divider>
      <AppTable ref="appTable" v-bind="appTable">
        <template #firstFixed>
          <el-table-column>
            <template v-slot="scope">
              <el-button
                type="danger"
                icon="el-icon-search"
                @click="onDetails(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </template>
        <template #executionTime>
          <el-table-column label="时间">
            <template v-slot="scope">
              {{
                moment(scope.row.executionTime).format("YYYY/MM/DD a h:mm:ss")
              }}
            </template>
          </el-table-column>
        </template>
      </AppTable>
    </el-tab-pane>
    <el-dialog :visible.sync="appTableDialog.visible" title="详情">
      <el-tabs>
        <el-tab-pane label="总体">
          <el-form label-width="100px" class="d-form" label-position="left">
            <el-form-item label="Http状态码">
              {{ appTableDialog.data.httpStatusCode }}
            </el-form-item>
            <el-form-item label="Http方法">
              {{ appTableDialog.data.httpMethod }}
            </el-form-item>
            <el-form-item label="Url">
              {{ appTableDialog.data.url }}
            </el-form-item>
            <el-form-item label="客户端IP地址">
              {{ appTableDialog.data.clientIpAddress }}
            </el-form-item>
            <el-form-item label="客户端名称">
              {{ appTableDialog.data.clientName }}
            </el-form-item>
            <el-form-item label="异常">
              {{ appTableDialog.data.exceptions }}
            </el-form-item>
            <el-form-item label="用户名">
              {{ appTableDialog.data.userName }}
            </el-form-item>
            <el-form-item label="时间">
              {{ appTableDialog.data.executionTime }}
            </el-form-item>
            <el-form-item label="持续时间">
              {{ appTableDialog.data.executionDuration }}
            </el-form-item>
            <el-form-item label="浏览器信息">
              {{ appTableDialog.data.browserInfo }}
            </el-form-item>
            <el-form-item label="应用名称">
              {{ appTableDialog.data.applicationName }}
            </el-form-item>
            <el-form-item label="关联Id">
              {{ appTableDialog.data.correlationId }}
            </el-form-item>
            <el-form-item label="评论">
              {{ appTableDialog.data.comments }}
            </el-form-item>
            <el-form-item label="额外属性">
              {{ appTableDialog.data.extraProperties }}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="`操作(${appTableDialog.data.actions.length})`">
          <el-form label-width="100px" class="d-form" label-position="left">
            <el-collapse accordion v-show="appTableDialog.data.actions.length>0">
              <el-collapse-item
                :title="item.ServiceName"
                v-for="(item, index) in appTableDialog.data.actions"
                :key="index"
              >
                <el-form-item label="持续时间">
                  {{ item.executionTime }}
                </el-form-item>
                <el-form-item label="参数">
                  {{ item.parameters }}
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="appTableDialog.visible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      appTable: {
        url: "/api/audit-logging/audit-logs",
        allowMultiple: false,
        params: {
          userName: "",
          url: "",
          minExecutionDuration: "",
          maxExecutionDuration: "",
          httpMethod: "",
          httpStatusCode: "",
          applicationName: "",
          correlationId: "",
          hasException: "",
        },
        columns: [
          { headerText: "Http请求", rowText: "url", sortable: "custom" },
          { headerText: "用户", rowText: "userName", sortable: "custom" },
          {
            headerText: "IP地址",
            rowText: "clientIpAddress",
            sortable: "custom",
          },
          { headerText: "时间", rowText: "executionTime", sortable: "custom" },
          {
            headerText: "持续时间",
            rowText: "executionDuration",
            sortable: "custom",
          },
          {
            headerText: "应用名称",
            rowText: "applicationName",
            sortable: "custom",
          },
        ],
      },
      appTableDialog: {
        visible: false,
        data: {
          userName: "",
          url: "",
          httpMethod: "",
          httpStatusCode: "",
          applicationName: "",
          correlationId: "",
          browserInfo: "",
          exceptions: "",
          executionDuration: "",
          executionTime: "",
          extraProperties: Object,
          comments: "",
          clientName: "",
          clientIpAddress: "",
          actions: [],
        },
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.appTable.go();
    },
    onDetails(row) {
      let self = this;
      Object.assign(self.appTableDialog.data, row);
      self.appTableDialog.visible = true;
    },
  },
};
</script>
<style scoped>
.el-divider {
  margin: 10px 0;
}
.d-form .el-form-item {
  margin-bottom: 0;
  border-bottom: 1px solid #eee;
}
</style>
<style>
.al-form div label {
  line-height: 10px;
}
.al-form div div div {
  width: 167px;
}
.al-form .el-form-item {
  margin-bottom: 15px;
}
.al-form .al-form-item div div {
  width: 250px;
}
.al-form .al-form-item-button div {
  height: 60px;
  position: relative;
}
.al-form .al-form-item-button div button {
  bottom: 0;
  position: absolute;
}
</style>