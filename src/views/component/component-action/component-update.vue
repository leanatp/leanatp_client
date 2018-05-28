<template>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
      </el-form-item>
      <el-form-item label="组件编号" prop="componentCode">
        <el-input v-model="dataForm.componentCode" placeholder="组件编号"></el-input>
      </el-form-item>
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="dataForm.componentName" placeholder="组件名称"></el-input>
      </el-form-item>
      <el-form-item label="组件类型" prop="componentType">
        <el-select v-model="dataForm.componentType" placeholder="请选择">
          <el-option
            v-for="item in componentTypeList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父节点ID" prop="categoryId">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="treeList"
            :props="treeListTreeProps"
            node-key="categoryUuid"
            ref="menuListTree"
            @current-change="treeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择业务组件" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
          </el-option>
        </el-select>
      </el-form-item>   
      <div style="text-align:center;"> 
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </div>   
    </el-form>
</template>

<script>
import API from "@/api";
import { treeDataTranslateForCategory, getTick4Category } from "@/utils";
export default {
  data() {
    return {
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
        parentComponentid: "",
        parentComponentuuid: "",
        status: "",
        componentType: "",
        parentName: ""
      },
      treeList: [],
      treeListTreeProps: {
        label: "categoryName",
        children: "children"
      },
      selectedNode: null,
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
  methods: {
    init(id) {
      this.dataForm.componentId = id;
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
        .then(() => {
          var tick = getTick4Category(API, "component");
          tick.listall().then(({ data }) => {
            this.treeList = treeDataTranslateForCategory(data, "categoryId");
          });
        })
        .then(() => {
          API.component.info(this.dataForm.componentId).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.componentUuid = data.component.componentUuid;
              this.dataForm.categoryId = data.component.categoryId;
              this.dataForm.componentCode = data.component.componentCode;
              this.dataForm.componentName = data.component.componentName;
              this.dataForm.orderNumber = data.component.orderNumber;
              this.dataForm.categoryUuid = data.component.categoryUuid;
              this.dataForm.parentComponentid =
                data.component.parentComponentid;
              this.dataForm.parentComponentuuid =
                data.component.parentComponentuuid;
              this.dataForm.status = data.component.status;
              this.dataForm.componentType = data.component.componentType;
              this.treeListTreeSetCurrentNode();
            }
          });
        });
    },
    // 菜单树选中
    treeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.categoryId = data.categoryId;
      this.dataForm.categoryUuid = data.categoryUuid;
      this.dataForm.parentName = data.categoryName;
      this.selectedNode = node;
    },
    // 菜单树设置当前选中节点
    treeListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.categoryUuid);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["categoryName"];
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            componentId: this.dataForm.componentId,
            categoryId: this.dataForm.categoryId,
            categoryUuid: this.dataForm.categoryUuid,
            componentCode: this.dataForm.componentCode,
            componentName: this.dataForm.componentName,
            orderNumber: this.dataForm.orderNumber,
            parentComponentid: undefined,
            parentComponentuuid: undefined,
            status: this.dataForm.status,
            componentType: this.dataForm.componentType
          };
          var tick = API.component.update(params);
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
