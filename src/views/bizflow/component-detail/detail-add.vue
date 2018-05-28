<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" class="dlg-text-centre dlg-body">
    <el-tabs v-model="activeName" class="rel-tabs-ctrl">
      <el-tab-pane label="业务流基本信息" name="bizflowInfo">
        <tabPane ref="tabBaseInfo" @refreshDataList="init" :currentEditNodeId="currentNodeId" :currentEditNodeUuid="currentNodeUuid"></tabPane>
      </el-tab-pane>
      <el-tab-pane label="关联业务组件" name="relComponent">
        <tabComponent @refreshDataList="init" :currentEditNodeId="currentNodeId" :currentEditNodeUuid="currentNodeUuid"></tabComponent>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import tabPane from "./tabs/tabBaseInfo.vue";
import tabComponent from "./tabs/tabRelComponent.vue";

export default {
  name: "tab",
  components: { tabPane, tabComponent },
  props:['currentNodeId', 'currentNodeUuid'],
  data() {
    return {
      tabMapOptions: [
        { label: "业务流基本信息", key: "bizflowInfo" },
        { label: "关联业务组件", key: "relComponent" }
      ],
      activeName: "bizflowInfo",
      dataForm: {},
      visible: false
    };
  },
  mounted(){    
  },
  methods: {
    show() {
      this.visible = true;
      console.log(this.currentNodeId)
    },
    init(){},
    dataFormSubmit(){
      this.$refs.tabBaseInfo.save()
    }
  }
};
</script>


  <style>
.dlg-body .el-dialog .el-dialog__body {
  padding-top: 5px !important;
}
.ctrl-userlist-selected {
  padding-top: 15px;
  padding-bottom: 15px;
}
.ctrl-userlist-selected-title {
  padding-bottom: 6px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.rel-tabs-ctrl {
  width: 100%;
}
</style>
