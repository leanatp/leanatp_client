<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="UUID" prop="componentelementUuid">
        <el-input v-model="dataForm.componentelementUuid" placeholder="UUID"></el-input>
      </el-form-item>
      <el-form-item label="组件ID" prop="componentId">
        <el-input v-model="dataForm.componentId" placeholder="组件ID"></el-input>
      </el-form-item>
      <el-form-item label="组件UUID" prop="componentUuid">
        <el-input v-model="dataForm.componentUuid" placeholder="组件UUID"></el-input>
      </el-form-item>
      <el-form-item label="控件类型" prop="ctrltype">
        <el-input v-model="dataForm.ctrltype" placeholder="控件类型"></el-input>
      </el-form-item>
      <el-form-item label="对象名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="对象名称"></el-input>
      </el-form-item>
      <el-form-item label="定位方式" prop="findmethod">
        <el-input v-model="dataForm.findmethod" placeholder="定位方式"></el-input>
      </el-form-item>
      <el-form-item label="定位参数" prop="findparams">
        <el-input v-model="dataForm.findparams" placeholder="定位参数"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item>
      <el-form-item label="参数代码" prop="paramCode">
        <el-input v-model="dataForm.paramCode" placeholder="参数代码"></el-input>
      </el-form-item>
      <el-form-item label="对象代码" prop="elementCode">
        <el-input v-model="dataForm.elementCode" placeholder="对象代码"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="最后更新时间" prop="updatedAt">
        <el-input v-model="dataForm.updatedAt" placeholder="最后更新时间"></el-input>
      </el-form-item>
      <el-form-item label="测试驱动" prop="testdriver">
        <el-input v-model="dataForm.testdriver" placeholder="测试驱动"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          componentelementId: 0,
          componentelementUuid: '',
          componentId: '',
          componentUuid: '',
          ctrltype: '',
          name: '',
          findmethod: '',
          findparams: '',
          status: '',
          paramCode: '',
          elementCode: '',
          orderNumber: '',
          description: '',
          updatedAt: '',
          testdriver: ''
        },
        dataRule: {
          componentelementUuid: [
            { required: true, message: 'UUID不能为空', trigger: 'blur' }
          ],
          componentId: [
            { required: true, message: '组件ID不能为空', trigger: 'blur' }
          ],
          componentUuid: [
            { required: true, message: '组件UUID不能为空', trigger: 'blur' }
          ],
          ctrltype: [
            { required: true, message: '控件类型不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '对象名称不能为空', trigger: 'blur' }
          ],
          findmethod: [
            { required: true, message: '定位方式不能为空', trigger: 'blur' }
          ],
          findparams: [
            { required: true, message: '定位参数不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          paramCode: [
            { required: true, message: '参数代码不能为空', trigger: 'blur' }
          ],
          elementCode: [
            { required: true, message: '对象代码不能为空', trigger: 'blur' }
          ],
          orderNumber: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          updatedAt: [
            { required: true, message: '最后更新时间不能为空', trigger: 'blur' }
          ],
          testdriver: [
            { required: true, message: '测试驱动不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.componentelementId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.componentelementId) {
            API.componentelement.info(this.dataForm.componentelementId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.componentelementUuid = data.componentelement.componentelementUuid
                this.dataForm.componentId = data.componentelement.componentId
                this.dataForm.componentUuid = data.componentelement.componentUuid
                this.dataForm.ctrltype = data.componentelement.ctrltype
                this.dataForm.name = data.componentelement.name
                this.dataForm.findmethod = data.componentelement.findmethod
                this.dataForm.findparams = data.componentelement.findparams
                this.dataForm.status = data.componentelement.status
                this.dataForm.paramCode = data.componentelement.paramCode
                this.dataForm.elementCode = data.componentelement.elementCode
                this.dataForm.orderNumber = data.componentelement.orderNumber
                this.dataForm.description = data.componentelement.description
                this.dataForm.updatedAt = data.componentelement.updatedAt
                this.dataForm.testdriver = data.componentelement.testdriver
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'componentelementId': this.dataForm.componentelementId || undefined,
              'componentelementUuid': this.dataForm.componentelementUuid,
              'componentId': this.dataForm.componentId,
              'componentUuid': this.dataForm.componentUuid,
              'ctrltype': this.dataForm.ctrltype,
              'name': this.dataForm.name,
              'findmethod': this.dataForm.findmethod,
              'findparams': this.dataForm.findparams,
              'status': this.dataForm.status,
              'paramCode': this.dataForm.paramCode,
              'elementCode': this.dataForm.elementCode,
              'orderNumber': this.dataForm.orderNumber,
              'description': this.dataForm.description,
              'updatedAt': this.dataForm.updatedAt,
              'testdriver': this.dataForm.testdriver
            }
            var tick = !this.dataForm.componentelementId ? API.componentelement.add(params) : API.componentelement.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
