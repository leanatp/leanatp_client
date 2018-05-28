<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
      </el-form-item>
      <el-form-item label="父节点ID" prop="parentId">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="treeNodeList"
            :props="treeNodeListProps"
            node-key="menuId"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="目录名称" prop="categoryName">
        <el-input v-model="dataForm.categoryName" placeholder="目录名称"></el-input>
      </el-form-item>
      <el-form-item label="可见类型" prop="visibleType">
        <el-select v-model="dataForm.visibleType" placeholder="请选择">
          <el-option
            v-for="item in categoryVisibleType"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in categoryStatus"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import API from "@/api";
import { treeDataTranslateForCategory, getTick4Category } from "@/utils";
export default {
  data() {
    return {
      visible: false,
      categoryType: '',
      dataForm: {
        categoryId: 0,
        parentId: 0,
        parentUuid: "",
        categoryName: "",
        visibleType: "",
        status: "",
        orderNumber: "",
        updatedAt: "",
        description: "",
        parentName: ""
      },
      dataRule: {
        parentId: [
          { required: true, message: "父节点ID不能为空", trigger: "blur" }
        ],
        parentUuid: [
          { required: true, message: "父节点UUID不能为空", trigger: "blur" }
        ],
        categoryName: [
          { required: true, message: "目录名称不能为空", trigger: "blur" }
        ],
        visibleType: [
          { required: true, message: "可见类型不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        orderNumber: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        updatedAt: [
          { required: true, message: "最后更新时间不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
      },
      treeNodeList: [],
      treeNodeListProps: {
        label: "categoryName",
        children: "children"
      },
      categoryStatus: [],
      categoryVisibleType: []      
    };
  },
  methods: {
    init(id, categoryType) {
      this.dataForm.categoryId = id || 0
      this.categoryType = categoryType
      API.sysbizdata
        .querykey("CategoryStatus")
        .then(({ data }) => {
          this.categoryStatus = data && data.code === 0 ? data.items : [];
        })
        .then(() => {
          API.sysbizdata.querykey("CategoryVisibleType").then(({ data }) => {
            this.categoryVisibleType = data && data.code === 0 ? data.items : [];
          });
        })
        .then(() => {
            var tick = getTick4Category(API, this.categoryType) 
            tick.listall().then(({ data }) => {
            this.treeNodeList = treeDataTranslateForCategory(data, "categoryId");
          });
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            categoryId: this.dataForm.categoryId || undefined,
            parentId: this.dataForm.parentId,
            parentUuid: this.dataForm.parentUuid,
            categoryName: this.dataForm.categoryName,
            visibleType: this.dataForm.visibleType,
            status: this.dataForm.status,
            orderNumber: this.dataForm.orderNumber,
            description: this.dataForm.description
          };         
          var tick = getTick4Category(API, this.categoryType)
          tick.add(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshTreeView");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.categoryId;
      this.dataForm.parentUuid = data.categoryUuid;
      this.dataForm.parentName = data.categoryName;
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    }
  }
};
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 370px;
  }
  &__icon-list {
    max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
