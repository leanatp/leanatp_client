<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="排序号" prop="orderNumber">
      <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
    </el-form-item>
    <el-form-item label="业务流名称" prop="bizflowName">
      <el-input v-model="dataForm.bizflowName" placeholder="业务流名称"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="dataForm.status" placeholder="请选择">
        <el-option v-for="item in statusList" :key="item.bizvalue" :label="item.bizname" :value="item.bizvalue">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input v-model="dataForm.description" placeholder="备注"></el-input>
    </el-form-item>
    <div v-if="false">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import API from "@/api";
import { treeDataTranslateForCategory } from "@/utils";
export default {
  props:['currentEditNodeId','currentEditNodeUuid'],
  data() {
    return {
      visible: false,
      componentTypeList: [],
      statusList: [],
      dataForm: {
        bizflowId: 0,
        bizflowUuid: "",
        categoryId: "",
        categroyUuid: "",
        bizflowName: "",
        status: "",
        description: "",
        orderNumber: "",
        updatedAt: ""
      },
      treeList: [],
      treeListTreeProps: {
        label: "categoryName",
        children: "children"
      },
      dataRule: {
        bizflowName: [
          { required: true, message: "业务流名称不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        orderNumber: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  created(){
    this.init()
  },
  methods: {
    init() {
      this.dataForm.bizflowId = 0;
      this.visible = true;
      this.statusList = this.componentTypeList = [];
      API.sysbizdata
        .querykey("ComponentStatus")
        .then(({ data }) => {
          this.statusList = data && data.code === 0 ? data.items : [];
        })
        .then(() => {
          this.$refs["dataForm"].resetFields();
        });
    },
    save(){
      this.dataFormSubmit()
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.currentEditNodeUuid)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            bizflowId: undefined,
            categoryId: this.currentEditNodeId,
            categoryUuid: this.currentEditNodeUuid,
            bizflowName: this.dataForm.bizflowName,
            status: this.dataForm.status,
            description: this.dataForm.description,
            orderNumber: this.dataForm.orderNumber
          };
          console.log(params)
          API.bizflow
            .add(params)
            .then(({ data }) => {
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
