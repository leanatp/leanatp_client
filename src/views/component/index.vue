<template>

  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>        
        <el-button v-if="isAuth('component:component:save')" type="primary" @click="addComponentHandler()">新增组件</el-button>
        <el-button v-if="isAuth('component:component:save') && addElementBtnVisible" type="primary" @click="addElementObjHandler()">新增组件对象</el-button>        
      </el-form-item>
    </el-form>
    <el-container style="height: auto; ">
      <el-aside width="300px" style="background-color: white;">        
        <v-jstree :data="treeList" no-dots text-field-name="nodeName" value-field-name="nodeUuid" ref="tree" @item-click="treeNodeClickHandler"	 ></v-jstree>
      </el-aside>  
      <el-container>   
        <el-main>
          <UpdateElementObj v-if="updateElementCtrlVisible" ref="UpdateElementObj" @updateElementObjCallback="updateElementObjCallback" @deleteElementObjCallback="deleteElementObjCallback" ></UpdateElementObj>                
          <UpdateComponent v-if="updateComponentCtrlVisible" ref="UpdateComponent" @refreshDataList="getDataList"  ></UpdateComponent>      
        </el-main>
      </el-container>
    </el-container>  
    <AddComponent v-if="addComponentCtrlVisible" ref="AddComponent" @refreshDataList="getDataList"></AddComponent>
    <AddElementObj v-if="addElementCtrlVisible" ref="AddElementObj" @addElementObjCallback="addElementObjCallback"></AddElementObj>
  </div>
</template>

<script>
import API from "@/api";
import AddComponent from "./component-action/component-add";
import UpdateComponent from "./component-action/component-update";
import AddElementObj from "./element-action/element-add";
import UpdateElementObj from "./element-action/element-update";
import { treeDataTranslate, ArraySortBy } from "@/utils";
import ComponentTreeView from "@/components/component-tree/treeview";
import VJstree from "vue-jstree";

export default {
  data() {
    return {
      treeList: [],
      treeListTreeProps: {
        label: "nodeName",
        children: "children"
      },
      tempKey: -666666,
      dataForm: {
        key: ""
      },
      dataListLoading: false,
      //component
      addComponentCtrlVisible: false,
      updateComponentCtrlVisible: false,
      //element object
      addElementBtnVisible: false,
      addElementCtrlVisible: false,
      updateElementCtrlVisible: false,
      //treenode
      selectedNode: null,
      selectedNodeData: null
    };
  },
  components: {
    AddComponent,
    UpdateComponent,
    ComponentTreeView,
    AddElementObj,
    UpdateElementObj,
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
      API.component.getTree(params).then(({ data }) => {
        this.treeList = treeDataTranslate(data.items, "nodeUuid", "parentUuid");
        this.$refs.tree.initializeData(this.treeList);
      });
    },
    treeNodeClickHandler(node) {
      this.addElementBtnVisible = false;
      this.selectedNode = node
      this.selectedNodeData = node.model
      if (node.model.nodeType === "component") {
        this.updateComponentHandler(node.model);
        this.addElementBtnVisible = true;
      }
      else{
        this.updateComponentCtrlVisible = false
      }
      if(node.model.nodeType !== "category" && node.model.nodeType != "component"){
        this.updateElementCtrlVisible = true
        this.updateElementObjHandler()
      }
      else{
        this.updateElementCtrlVisible = false
      }
    },
    updateComponentHandler(node) {
      this.updateComponentCtrlVisible = true;
      this.$nextTick(() => {
        this.$refs.UpdateComponent.init(node.nodeId);
      });
    },
    addComponentHandler(id) {
      this.addComponentCtrlVisible = true;
      this.$nextTick(() => {
        this.$refs.AddComponent.init(id);
      });
    },
    treeNodeSelectedHandler(node) {
      this.selectedNode = node;
      if (node.nodeType !== "category") {
        this.addElementBtnVisible = false;
      } else {
        this.addElementBtnVisible = true;
      }
      if (node.nodeType === "component") this.updateComponentHandler(node);
    },
    addElementObjHandler() {
      this.addElementCtrlVisible = true;
      this.addComponentCtrlVisible = false;
      this.$nextTick(() => {
        this.$refs.AddElementObj.init(
          this.selectedNodeData.nodeType,
          this.selectedNodeData.nodeId,
          this.selectedNodeData.nodeUuid,
          this.selectedNodeData.nodeName
        );
      });
    },
    updateElementObjHandler(){
      this.updateElementCtrlVisible = true
      this.$nextTick(()=>{
        this.$refs.UpdateElementObj.init(this.selectedNodeData.nodeId)
      })
    },
    addElementObjCallback(newEleObj) {
      this.selectedNodeData.addChild(
        {
          nodeId: newEleObj.componentelementId,
          nodeUuid: newEleObj.componentelementUuid,
          nodeName: newEleObj.name,
          nodeType: newEleObj.elementType,
          parentId: this.selectedNodeData.nodeId,
          parentUuid: this.selectedNodeData.nodeUuid,
          parentName: this.selectedNodeData.nodeName,
          icon: newEleObj.elementIcon,
          orderNumber: newEleObj.orderNumber
        },
        this.selectedNode
      );
      this.selectedNodeData.children.sort(ArraySortBy("orderNumber", true));
    },
    updateElementObjCallback(updateElementObj){
      this.selectedNode.nodeName = updateElementObj.name
      this.selectedNode.icon = updateElementObj.elementIcon
      this.selectedNode.nodeType = updateElementObj.elementType
      this.selectedNode.orderNumber = updateElementObj.orderNumber
      this.selectedNode.parentItem.sort(ArraySortBy("orderNumber", true));
    },
    deleteElementObjCallback(delElementObjUuid){
      var index = this.selectedNode.parentItem.indexOf(this.selectedNode.parentItem.filter(item=> item.nodeUuid == delElementObjUuid)[0])
      this.selectedNode.parentItem.splice(index, 1)
      this.updateElementCtrlVisible = false
    }
  }
};
</script>
