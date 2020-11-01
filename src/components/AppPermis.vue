<template>
  <div>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckGlobalAllChange"
      >授予所有权限</el-checkbox
    >
    <el-divider />
    <el-tabs tab-position="left">
      <el-tab-pane
        v-for="item in groups"
        :key="item.name"
        :label="item.displayName"
      >
        <span>{{ item.displayName }}</span>
        <el-divider />
        <el-checkbox
          :id="item.name"
          v-model="checkeds[item.name].checkAll"
          :indeterminate="checkeds[item.name].isIndeterminate"
          @change="(checked) => handleCheckAllChange(checked, item)"
          >全选</el-checkbox
        >
        <el-divider />
        <el-checkbox-group
          v-model="checkeds[item.name].items"
          @change="(value) => handleCheckGroupChange(value, item)"
        >
          <el-checkbox
            @change="(checked) => handleCheckItemChange(checked, _item)"
            v-for="_item in item.permissions"
            :key="_item.name"
            :style="`margin-left:${_item.parentName ? '20' : '0'}px;width:100%`"
            :label="_item.name"
            :disabled="_item.isGranted&&isAdmin"
            >{{ _item.displayName }}
            <template v-if="_item.isGranted">
              <span
                style="color: black"
                v-for="(_granted, index) in _item.grantedProviders"
                :key="index"
                >{{ _granted.providerName }}:{{ _granted.providerKey }}</span
              >
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    //v-model
    value: {
      type: Array,
      default: () => {},
    },
    providerKey: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      groups: [],
      checkeds: {},
      isIndeterminate: false,
      checkAll: false,
      putItems: [],
      isAdmin: false,
    };
  },
  methods: {
    handleCheckItemChange(value, item) {
      let self = this;
      if (value) {
        if (!item.isGranted) {
          //向提交数据中新增
          self.putItems.push({ name: item.name, isGranted: true });
        } else {
          //从提交数据中删除
          let index = self._.findIndex(self.putItems, { name: item.name });
          if (index != -1) {
            self.putItems.splice(index, 1);
          }
        }
      } else {
        if (item.isGranted) {
          //向提交数据中新增
          self.putItems.push({ name: item.name, isGranted: false });
        } else {
          //从提交数据中删除
          let index = self._.findIndex(self.putItems, { name: item.name });
          if (index != -1) {
            self.putItems.splice(index, 1);
          }
        }
      }
      this.$emit("input", self.putItems);
    },
    reload() {
      let self = this;
      self.isAdmin=self.providerKey=="admin";
      self.getPermissions();
    },
    handleCheckGlobalAllChange(val) {
      let self = this;
      self.isIndeterminate = false;
      self.checkAll = !val;
      self._.forEach(self.groups, function (item) {
        self.checkeds[item.name].checkAll = !val;
        $(`#${item.name} :checkbox`).prop("checked", !val).click();
      });
    },
    checkAllChange() {
      let self = this;
      let _c = 0;
      let _g = 0;
      let checkCount = 0;
      self._.forEach(self.checkeds, function (item) {
        _c += item.items.length;
        if (item.checkAll) {
          checkCount++;
        }
      });
      if (!self.isAdmin) {
        self._.forEach(self.groups, function (item) {
          _g += item.permissions.length;
        });
        self.isIndeterminate = _c == 0 ? false : _g != _c;
        self.checkAll = _c == 0 ? false : _g == _c;
      } else {
        self.isIndeterminate =
        checkCount != self.groups.length && checkCount != 0;
        self.checkAll = checkCount == self.groups.length && checkCount != 0;
      }
    },
    handleCheckAllChange(checked, item) {
      let self = this;
      if (!self.isAdmin) {
        let currentItems = [];
        self._.forEach(item.permissions, function (item) {
          currentItems.push(item.name);
          self.handleCheckItemChange(checked, item);
        });
        self.checkeds[item.name].items = checked ? currentItems : [];
        self.checkeds[item.name].isIndeterminate = false;
      }
      self.checkAllChange();
    },
    handleCheckGroupChange(value, item) {
      let self = this;
      let checkedCount = value.length;
      let itemsCount = item.permissions.length;
      self.checkeds[item.name].checkAll = checkedCount === itemsCount;
      self.checkeds[item.name].isIndeterminate =
        checkedCount > 0 && checkedCount < itemsCount;
      self.checkAllChange();
    },
    getPermissions() {
      let self = this;
      self.$http
        .get(`/api/abp/permissions`, {
          params: {
            providerKey: self.providerKey,
            providerName: self.providerName,
          },
        })
        .then(function (response) {
          self.groups = response.data.groups;
          self._.forEach(response.data.groups, function (item) {
            let items = [];
            self._.filter(item.permissions, { isGranted: true }).forEach(
              function (p) {
                items.push(p.name);
              }
            );
            self.$set(self.checkeds, item.name, {
              items: items,
              isIndeterminate:
                item.permissions.length != items.length && items.length != 0,
              checkAll:
                item.permissions.length == items.length && items.length != 0,
            });
            self.checkAllChange();
          });
        });
    },
  },
};
</script>
