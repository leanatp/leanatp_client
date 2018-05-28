<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="所属组件" prop="parentCtrlName">
      <el-input v-model="parentCtrlName" placeholder="组件UUID" disabled=""></el-input>
    </el-form-item>
    <el-form-item label="对象类型" prop="elementCategory">
      <el-select v-model="dataForm.elementCategory" placeholder="请选择" @change="elementCategorySelectedHandler()">
        <el-option v-for="item in bizElementCategoryList" :key="item.bizvalue" :label="item.bizname" :value="item.bizvalue">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="对象类型明细" prop="elementType">
      <el-select v-model="dataForm.elementType" placeholder="请选择">
        <el-option v-for="item in bizElementTypeList" :key="item.bizvalue" :label="item.bizname" :value="item.bizvalue">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="对象名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="对象名称"></el-input>
    </el-form-item>
    <el-form-item label="对象代码" prop="elementCode">
      <el-input v-model="dataForm.elementCode" placeholder="对象代码"></el-input>
    </el-form-item>
    <el-form-item label="定位方式" prop="findmethod">
      <el-select v-model="dataForm.findmethod" placeholder="请选择">
        <el-option v-for="item in bizFindMethodList" :key="item.bizvalue" :label="item.bizname" :value="item.bizvalue">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="定位参数" prop="findparams">
      <el-input v-model="dataForm.findparams" placeholder="定位参数"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="dataForm.status" placeholder="请选择">
        <el-option v-for="item in bizStatusList" :key="item.bizvalue" :label="item.bizname" :value="item.bizvalue">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参数代码" prop="paramCode">
      <el-input v-model="dataForm.paramCode" placeholder="参数代码"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="orderNumber">
      <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input v-model="dataForm.description" placeholder="备注"></el-input>
    </el-form-item>
    <div style="text-align:center;">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button type="danger" @click="deleteHandle()">删除</el-button>
    </div>
  </el-form>
</template>

<script>
import API from "@/api";
export default {
  data() {
    return {
      visible: false,
      bizElementTypeList: [],
      bizFindMethodList: [],
      bizStatusList: [],
      bizElementCategoryList: [],

      parentCtrlId: 0,
      parentCtrlUuid: "",
      parentCtrlType: "",
      parentCtrlName: "",

      dataForm: {
        componentelementId: 0,
        componentelementUuid: "",
        componentId: "",
        componentUuid: "",
        elementType: "",
        elementCategory: "",
        name: "",
        findmethod: "",
        findparams: "",
        status: "",
        paramCode: "",
        elementCode: "",
        orderNumber: "",
        description: "",
        updatedAt: "",
        testdriver: "",
        parentID: 0,
        parentUuid: "",
        elementIcon: "",

        parenName: ""
      },
      dataRule: {
        componentId: [
          { required: true, message: "组件ID不能为空", trigger: "blur" }
        ],
        componentUuid: [
          { required: true, message: "组件UUID不能为空", trigger: "blur" }
        ],
        elementType: [
          { required: true, message: "控件类型不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "对象名称不能为空", trigger: "blur" }
        ],
        findmethod: [
          { required: true, message: "定位方式不能为空", trigger: "blur" }
        ],
        findparams: [
          { required: true, message: "定位参数不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        paramCode: [
          { required: true, message: "参数代码不能为空", trigger: "blur" }
        ],
        elementCode: [
          { required: true, message: "对象代码不能为空", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "排序号不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        updatedAt: [
          { required: true, message: "最后更新时间不能为空", trigger: "blur" }
        ],
        testdriver: [
          { required: true, message: "测试驱动不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.componentelementId = id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.componentelementId) {
          var _elementType, _elementCategory;
          API.componentbizdata
            .querykey("ElementCategory")
            .then(({ data }) => {
              this.bizElementCategoryList =
                data && data.code === 0 ? data.items : [];
            })
            .then(() => {
              API.componentbizdata
                .querykey("ElementFindMethod")
                .then(({ data }) => {
                  this.bizFindMethodList =
                    data && data.code === 0 ? data.items : [];
                });
            })
            .then(() => {
              API.sysbizdata.querykey("ComponentStatus").then(({ data }) => {
                this.bizStatusList = data && data.code === 0 ? data.items : [];
              });
            })
            .then(() => {
              API.componentelement
                .info(this.dataForm.componentelementId)
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    this.dataForm.componentelementUuid =
                      data.componentelement.componentelementUuid;
                    this.dataForm.componentId =
                      data.componentelement.componentId;
                    this.dataForm.componentUuid =
                      data.componentelement.componentUuid;
                    this.dataForm.elementCategory =
                      data.componentelement.elementCategory;
                    this.dataForm.elementType =
                      data.componentelement.elementType;
                    this.dataForm.name = data.componentelement.name;
                    this.dataForm.findmethod = data.componentelement.findmethod;
                    this.dataForm.findparams = data.componentelement.findparams;
                    this.dataForm.status = data.componentelement.status;
                    this.dataForm.paramCode = data.componentelement.paramCode;
                    this.dataForm.elementCode =
                      data.componentelement.elementCode;
                    this.dataForm.orderNumber =
                      data.componentelement.orderNumber;
                    this.dataForm.description =
                      data.componentelement.description;
                    this.dataForm.updatedAt = data.componentelement.updatedAt;
                    this.dataForm.testdriver = data.componentelement.testdriver;
                    this.elementCategorySelectedHandler(
                      data.componentelement.elementCategory
                    );
                  }
                });
            });
        }
      });
    },
    elementCategorySelectedHandler(category) {
      this.bizElementTypeList = [];
      var params = {
        bizkey: "ElementType",
        parentBizkey: category || this.dataForm.elementCategory
      };
      API.componentbizdata.querykeyWithParent(params).then(({ data }) => {
        this.bizElementTypeList = data && data.code === 0 ? data.items : [];
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            componentelementId: this.dataForm.componentelementId || undefined,
            componentelementUuid: this.dataForm.componentelementUuid,
            componentId: this.dataForm.componentId,
            componentUuid: this.dataForm.componentUuid,
            elementType: this.dataForm.elementType,
            elementCategory: this.dataForm.elementCategory,
            name: this.dataForm.name,
            findmethod: this.dataForm.findmethod,
            findparams: this.dataForm.findparams,
            status: this.dataForm.status,
            paramCode: this.dataForm.paramCode,
            elementCode: this.dataForm.elementCode,
            orderNumber: this.dataForm.orderNumber,
            description: this.dataForm.description,
            updatedAt: this.dataForm.updatedAt,
            testdriver: this.dataForm.testdriver,
            elementIcon: this.bizElementTypeList.filter(
              item => item.bizvalue == this.dataForm.elementType
            )[0].description
          };
          API.componentelement.update(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("updateElementObjCallback", data.componentelement);
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    deleteHandle() {
      this.$confirm(`确定删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = [this.dataForm.componentelementId];
        API.componentelement.del(params).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit(
                  "deleteElementObjCallback",
                  this.dataForm.componentelementUuid
                );
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};

