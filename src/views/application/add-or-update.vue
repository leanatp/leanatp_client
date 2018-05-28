<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="应用名称" prop="applicationName">
        <el-input v-model="dataForm.applicationName" placeholder="应用名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in applicationStatus"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统架构" prop="architecture">
        <el-select v-model="dataForm.architecture" placeholder="请选择" @change="architectureChangeHandler()">
          <el-option
            v-for="item in applicationArchitecture"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试驱动" prop="testDriver">
        <el-select v-model="dataForm.testDriver" placeholder="请选择">
          <el-option
            v-for="item in applicationTestDriver"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="应用可见状态" prop="visibletType">
        <el-select v-model="dataForm.visibletType" placeholder="请选择">
          <el-option
            v-for="item in applicationVisibleType"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前版本" prop="version">
        <el-input v-model="dataForm.version" placeholder="当前版本"></el-input>
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
      applicationStatus: [],
      applicationArchitecture: [],
      applicationTestDriver: [],
      applicationVisibleType:[],
      dataForm: {
        applicationId: 0,
        applicationName: "",
        status: "",
        architecture: "",
        testDriver: "",
        description: "",
        visibletType: "",
        updatedAt: "",
        applicationUuid: "",
        version: ""
      },
      dataRule: {
        applicationName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        architecture: [
          { required: true, message: "系统架构不能为空", trigger: "blur" }
        ],
        testDriver: [
          { required: true, message: "测试驱动不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        visibletType: [
          { required: true, message: "应用可见状态不能为空", trigger: "blur" }
        ],
        updatedAt: [
          { required: true, message: "最后更新时间不能为空", trigger: "blur" }
        ],
        applicationUuid: [
          { required: true, message: "唯一GUID不能为空", trigger: "blur" }
        ],
        version: [
          { required: true, message: "当前版本不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.applicationId = id || 0;
      API.sysbizdata
        .querykey("ApplicationStatus")
        .then(({ data }) => {
          this.applicationStatus = data && data.code === 0 ? data.items : [];
        })
        .then(() => {
          API.sysbizdata.querykey("ApplicationArchitecture")
          .then(({ data }) => {
              this.applicationArchitecture =
                data && data.code === 0 ? data.items : [];
            })
        }) 
        .then(() => {
          API.sysbizdata.querykey("ApplicationVisibleType")
          .then(({ data }) => {
              this.applicationVisibleType =
                data && data.code === 0 ? data.items : [];
            })
        })        
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.applicationId) {
            API.application
              .info(this.dataForm.applicationId)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.applicationName =
                    data.application.applicationName;
                  this.dataForm.status = data.application.status;
                  this.dataForm.architecture = data.application.architecture;
                  this.dataForm.testDriver = data.application.testDriver;
                  this.dataForm.description = data.application.description;
                  this.dataForm.visibletType = data.application.visibletType;
                  this.dataForm.updatedAt = data.application.updatedAt;
                  this.dataForm.applicationUuid =
                    data.application.applicationUuid;
                  this.dataForm.version = data.application.version;
                }
              });
          }
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            applicationId: this.dataForm.applicationId || undefined,
            applicationName: this.dataForm.applicationName,
            status: this.dataForm.status,
            architecture: this.dataForm.architecture,
            testDriver: this.dataForm.testDriver,
            description: this.dataForm.description,
            visibletType: this.dataForm.visibletType,
            updatedAt: this.dataForm.updatedAt,
            applicationUuid: this.dataForm.applicationUuid,
            version: this.dataForm.version
          };
          var tick = !this.dataForm.applicationId
            ? API.application.add(params)
            : API.application.update(params);
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
    },
    architectureChangeHandler(){
      this.applicationTestDriver = []
      this.dataForm.testDriver = ""
      var params = {
        bizkey: "ApplicationTestDriver",
        parentBizkey: this.dataForm.architecture
      }
       API.sysbizdata
        .querykeyWithParent (params)
        .then(({ data }) => {
          this.applicationTestDriver = data && data.code === 0 ? data.items : [];
        })
    }
  }
};
</script>
