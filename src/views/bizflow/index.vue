<template>
  <div class="mod-config">
    <el-form :inline="true" @keyup.enter.native="getDataList()" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('bizflow:bizflow:save')" type="primary" @click="addBizflowHandler">新增业务流</el-button>
      </el-form-item>
    </el-form>
    <el-container style="height: auto; ">
      <el-aside width="300px" style="background-color: white;">
        <v-jstree :data="treeList" no-dots text-field-name="nodeName" value-field-name="nodeUuid" ref="categoryTree" @item-click="treeNodeClickHandler"></v-jstree>
      </el-aside>
      <el-container style="width:100%">
          <AddDetail v-if="editDetailCtrlVisible" :currentNodeId="currentNodeId" :currentNodeUuid="currentNodeUuid" ref="AddDetail" @refreshDataList="getDataList"></AddDetail>
      </el-container>
    </el-container>    
  </div>
</template>

<script>
import API from "@/api";
import AddDetail from "./component-detail/detail-add.vue";
import { treeDataTranslate, ArraySortBy } from "@/utils";
import VJstree from "vue-jstree";

export default {
  data() {
    return {
      treeList: [],
      treeListTreeProps: {
        label: "nodeName",
        children: "children"
      },
      tempKey: -66226666,
      dataForm: {
        key: "bizFlow",
        
      },      
      dataListLoading: false,
      editDetailCtrlVisible: false,
      editDetailBtnVisible: false,
      //treenode
      selectedNode: null,
      selectedNodeData: null,
      //params
      currentNodeId: 0,
      currentNodeUuid: ""
    };
  },
  components: {
    AddDetail,
    VJstree
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.dataForm.key
      };
      API.bizflow.getTree(params).then(({ data }) => {
        this.treeList = treeDataTranslate(data.items, "nodeUuid", "parentUuid");
        this.$refs.categoryTree.initializeData(this.treeList);
      });
    },
    treeNodeClickHandler(node) {
      this.selectedNode = node
      this.selectedNodeData = node.model
      this.editDetailCtrlVisible = this.editDetailBtnVisible = false
      if(this.selectedNodeData.nodeType === "category"){
        this.editDetailBtnVisible = true
      }      
    },
    //新建业务流Handler
    addBizflowHandler() {
      if(!this.selectedNode)
      {
        this.$message.error("请选择一个节点");
        return;
      }
      this.editDetailCtrlVisible = true;
      this.currentNodeId = this.selectedNodeData.nodeId;
      this.currentNodeUuid = this.selectedNodeData.nodeUuid;      
      this.$nextTick(() => {
        this.$refs.AddDetail.show();
      });
    }
  }
};
</script>
