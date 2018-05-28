<template>
  <el-dialog
    title="新增组件对象"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">      
      <el-form-item label="所属组件" prop="parentCtrlName">
        <el-input v-model="parentCtrlName" placeholder="组件UUID" disabled=""></el-input>
      </el-form-item>
      <el-form-item label="对象类型" prop="elementCategory">
        <el-select v-model="dataForm.elementCategory" placeholder="请选择" @change="elementCategorySelectedHandler()">
          <el-option
            v-for="item in bizElementCategoryList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对象类型明细" prop="elementType">
        <el-select v-model="dataForm.elementType" placeholder="请选择">
          <el-option
            v-for="item in bizElementTypeList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
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
          <el-option
            v-for="item in bizFindMethodList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="定位参数" prop="findparams">
        <el-input v-model="dataForm.findparams" placeholder="定位参数"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in bizStatusList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
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

        parentName: ""
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
    init(parentType, parentId, parentUuid, parentName) {
      this.parentCtrlType = parentType;
      this.parentCtrlId = parentId;
      this.parentCtrlUuid = parentUuid;
      this.parentCtrlName = parentName;
      this.dataForm.componentelementId = 0;
      this.visible = true;
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
          this.$refs["dataForm"].resetFields();
        });
    },
    elementCategorySelectedHandler() {
      this.bizElementTypeList = [];
      var params = {
        bizkey: "ElementType",
        parentBizkey: this.dataForm.elementCategory
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
            componentelementId: undefined,
            componentId: this.parentCtrlType === "component" ? this.parentCtrlId : undefined,
            componentUuid: this.parentCtrlType === "component" ? this.parentCtrlUuid : undefined,
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
            testdriver: this.dataForm.testdriver,
            parentId : this.parentCtrlType === "component" ? undefined:this.parentCtrlId ,
            parentUuid: this.parentCtrlType === "component" ? undefined:this.parentCtrlUuid,
            elementIcon: this.bizElementTypeList.filter(item=> item.bizvalue == this.dataForm.elementType)[0].description
          };
          
          API.componentelement.add(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("addElementObjCallback", data.componentelement);
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
