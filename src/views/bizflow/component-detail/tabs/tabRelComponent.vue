<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="10">
        <div>组件目录</div>
        <div class="grid-content ">
          <v-jstree :data="treeList" no-dots text-field-name="nodeName" value-field-name="nodeUuid" ref="tree" @item-click="treeNodeClickHandler1">
            <template slot-scope="node1">
              <div style="display: inherit; width: 200px" >
                <i :class="node1.vm.themeIconClasses" role="presentation" v-if="!node1.model.loading"></i>
                {{node1.model.nodeName}}
                <button style="border: 0px; background-color: transparent; cursor: pointer;">
                  <i v-if="node1.model.nodeType === 'component'" :class="'iconfont icon-add1'" @click="customItemClick(node1.vm, node1.model, $event)"></i>
                </button>
              </div>
            </template>
          </v-jstree>
        </div>
      </el-col>
      <el-col :span="14">
        <div>业务流图</div>
        <div class="grid-content" style="text-align: center;">
          <rel-tree :data="bizFlowNodesObj" :horizontal="horizontal" :collapsable="collapsable" :label-class-name="labelClassName" :render-content="renderContent" @on-expand="onExpand"  @on-node-click="onNodeClick" >
          </rel-tree>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import API from "@/api";
import VJstree from "vue-jstree";
import {
  treeDataTranslateForCategory,
  treeDataTranslate,
  ArraySortBy,
  getTick4Category,
  relTreeDataTranslate
} from "@/utils";
import RelTree from "../rel-tree/rel-tree.vue";
export default {
  data() {
    return {      
      horizontal: false,
      collapsable: true,
      labelClassName: "bg-white",

      currentEditNodeId: 0,
      currentEditNodeUuid: "",

      visible: false,
      componentTypeList: [],
      statusList: [],
      dataForm: {
        componentId: 0,
        componentUuid: "",
        categoryUuid: "",
        categoryId: "",
        componentCode: "",
        componentName: "",
        orderNumber: "",
        updatedAt: "",
        parentComponentid: "",
        parentComponentuuid: "",
        status: "",
        componentType: "",
        parentName: ""
      },
      treeList: [],
      treeListTreeProps: {
        label: "nodeName",
        children: "children"
      },
      selectedNode: null,
      bizFlowNodesObj:{},
      bizFlowNodes:[],
      dataRule: {
        componentCode: [
          { required: true, message: "组件编号不能为空", trigger: "blur" }
        ],
        componentName: [
          { required: true, message: "组件名称不能为空", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        componentType: [
          { required: true, message: "组件类型不能为空", trigger: "blur" }
        ],
        parentId: [{ required: true, message: "请选择父组件", trigger: "blue" }]
      }
    };
  },
  components: {
    RelTree,
    VJstree
  },
  created() {
    var params = {
      page: this.pageIndex,
      limit: this.pageSize,
      key: this.dataForm.key
    };
    API.component.getTreeWithoutEle(params).then(({ data }) => {
      this.treeList = treeDataTranslate(data.items, "nodeUuid", "parentUuid");
      this.$refs.tree.initializeData(this.treeList);
    });
  },
  methods: {
    renderContent(h, data) {
      if(data&&data.nodeObj)
        return data.nodeObj.nodeName
      else
        return ""
    },
    init(id) {
      this.dataForm.componentId = 0;
      this.visible = true;
      this.statusList = this.componentTypeList = [];
      API.componentbizdata
        .querykey("ComponentType")
        .then(({ data }) => {
          this.componentTypeList = data && data.code === 0 ? data.items : [];
        })
        .then(() => {
          API.sysbizdata.querykey("ComponentStatus").then(({ data }) => {
            this.statusList = data && data.code === 0 ? data.items : [];
          });
        })
        // .then(() => {
        //   var tick = getTick4Category(API, "component");
        //   tick.listall().then(({ data }) => {
        //     this.treeList = treeDataTranslateForCategory(data, "categoryId");
        //   });
        // })
        .then(() => {
          this.$refs["dataForm"].resetFields();
        });
    },
    customItemClick(vm, model, event) {      
      // if(this.bizFlowNodes.length > 0)
      // {
      //   this.bizFlowNodesObj = {}
      //   this.bizFlowNodes = []
      //   return
      // }
      var _model = model
      this.bizFlowNodesObj = {}
      this.bizFlowNodes.push({
        id: _model.nodeId,
        nodeObj: _model        
      })
      let ls = []
      ls = ls.concat(this.bizFlowNodes)
      console.log(this.bizFlowNodes)
      this.bizFlowNodesObj = relTreeDataTranslate(ls);
    },
    onExpand(data) {
      if ("expand" in data) {
        data.expand = !data.expand;

        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    onNodeClick(e, data) {
      this.bizFlowNodesObj = {
        id: 0,
        label: "XXX科技有限公司1",
        guid: "asdfasf",
        children: [
          {
            id: 2,
            label: "产品研发部",
            children: [
              {
                id: 5,
                label: "研发-前端"
              }
            ]
          },
          {
            id: 3,
            label: "销售部",
            children: [
              {
                id: 7,
                label: "销售一部"
              },
              {
                id: 8,
                label: "销售二部"
              }
            ]
          },
          {
            id: 4,
            label: "财务部"
          },
          {
            id: 9,
            label: "HR人事"
          }
        ]
      };
    },
    collapse(list) {
      list.forEach(child => {
        if (child.expand) {
          child.expand = false;
        }

        child.children && this.collapse(child.children);
      });
    },
    treeNodeClickHandler1() {},
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            componentId: undefined,
            categoryId: this.dataForm.parentId,
            categoryUuid: this.dataForm.parentUuid,
            componentCode: this.dataForm.componentCode,
            componentName: this.dataForm.componentName,
            orderNumber: this.dataForm.orderNumber,
            parentComponentid: undefined,
            parentComponentuuid: undefined,
            status: this.dataForm.status,
            componentType: this.dataForm.componentType
          };
          var tick = !this.dataForm.componentId
            ? API.component.add(params)
            : API.component.update(params);
          tick.then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
<style>
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
}
.bg-tomato {
  background-color: tomato;
}
.org-tree-container {
  display: inline-block;
  padding: 15px;
  background-color: #fff;
}
.org-tree {
  display: table;
  text-align: center;
}
.org-tree:before,
.org-tree:after {
  content: "";
  display: table;
}
.org-tree:after {
  clear: both;
}
.org-tree-node,
.org-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.org-tree-node:before,
.org-tree-node-children:before,
.org-tree-node:after,
.org-tree-node-children:after {
  transition: all 0.35s;
}
.org-tree-node-label {
  position: relative;
  display: inline-block;
}
.org-tree-node-label .org-tree-node-label-inner {
  padding: 10px 15px;
  text-align: center;
  border-radius: 3px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.org-tree-node-btn {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20px;
  height: 20px;
  z-index: 10;
  margin-left: -11px;
  margin-top: 9px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.35s ease;
}
.org-tree-node-btn:hover {
  background-color: #e7e8e9;
  transform: scale(1.15);
}
.org-tree-node-btn:before,
.org-tree-node-btn:after {
  content: "";
  position: absolute;
}
.org-tree-node-btn:before {
  top: 50%;
  left: 4px;
  right: 4px;
  height: 0;
  border-top: 1px solid #ccc;
}
.org-tree-node-btn:after {
  top: 4px;
  left: 50%;
  bottom: 4px;
  width: 0;
  border-left: 1px solid #ccc;
}
.org-tree-node-btn.expanded:after {
  border: none;
}
.org-tree-node {
  padding-top: 20px;
}
.org-tree-node:not(:only-child) {
  float: left;
}
.org-tree-node.is-leaf,
.org-tree-node.collapsed {
  padding-left: 10px;
  padding-right: 10px;
}
.org-tree-node:before,
.org-tree-node:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 19px;
}
.org-tree-node:after {
  left: 50%;
  border-left: 1px solid #ddd;
}
.org-tree-node:not(:first-child):before,
.org-tree-node:not(:last-child):after {
  border-top: 1px solid #ddd;
}
.collapsable .org-tree-node.collapsed {
  padding-bottom: 30px;
}
.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 50%;
  height: 20px;
  border-right: 1px solid #ddd;
}
.org-tree > .org-tree-node {
  padding-top: 0;
}
.org-tree > .org-tree-node:after {
  border-left: 0;
}
.org-tree-node-children {
  padding-top: 20px;
}
.org-tree-node-children:before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 20px;
  border-left: 1px solid #ddd;
}
.org-tree-node-children:after {
  content: "";
  display: table;
  clear: both;
}
.horizontal .org-tree-node {
  display: table-cell;
  float: none;
  padding-top: 0;
  padding-left: 20px;
}
.horizontal .org-tree-node.is-leaf,
.horizontal .org-tree-node.collapsed {
  padding-top: 10px;
  padding-bottom: 10px;
}
.horizontal .org-tree-node:before,
.horizontal .org-tree-node:after {
  width: 19px;
  height: 50%;
}
.horizontal .org-tree-node:after {
  top: 50%;
  left: 0;
  border-left: 0;
}
.horizontal .org-tree-node:only-child:before {
  border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:first-child):before,
.horizontal .org-tree-node:not(:last-child):after {
  border-top: 0;
  border-left: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:only-child):after {
  border-top: 1px solid #ddd;
}
.horizontal .org-tree-node .org-tree-node-inner {
  display: table;
}
.horizontal .org-tree-node-label {
  display: table-cell;
  vertical-align: middle;
}
.horizontal.collapsable .org-tree-node.collapsed {
  padding-right: 30px;
}
.horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
  top: 0;
  left: 100%;
  width: 20px;
  height: 50%;
  border-right: 0;
  border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node-btn {
  top: 50%;
  left: 100%;
  margin-top: -11px;
  margin-left: 9px;
}
.horizontal > .org-tree-node:only-child:before {
  border-bottom: 0;
}
.horizontal .org-tree-node-children {
  display: table-cell;
  padding-top: 0;
  padding-left: 20px;
}
.horizontal .org-tree-node-children:before {
  top: 50%;
  left: 0;
  width: 20px;
  height: 0;
  border-left: 0;
  border-top: 1px solid #ddd;
}
.horizontal .org-tree-node-children:after {
  display: none;
}
.horizontal .org-tree-node-children > .org-tree-node {
  display: block;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>