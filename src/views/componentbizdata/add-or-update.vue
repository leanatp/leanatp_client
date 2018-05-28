<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="测试驱动" prop="testdriver">
        <el-input v-model="dataForm.testdriver" placeholder="测试驱动"></el-input>
      </el-form-item>
      <el-form-item label="Key" prop="bizkey">
        <el-input v-model="dataForm.bizkey" placeholder="Key"></el-input>
      </el-form-item>
      <el-form-item label="Name" prop="bizname">
        <el-input v-model="dataForm.bizname" placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item label="Value" prop="bizvalue">
        <el-input v-model="dataForm.bizvalue" placeholder="Value"></el-input>
      </el-form-item>
      <el-form-item label="父Key" prop="parentbizkey">
        <el-input v-model="dataForm.parentbizkey" placeholder="父Key"></el-input>
      </el-form-item>
      <el-form-item label="父Value" prop="parentbizvalue">
        <el-input v-model="dataForm.parentbizvalue" placeholder="父Value"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item>
      <el-form-item label="最后更新时间" prop="updatedAt">
        <el-input v-model="dataForm.updatedAt" placeholder="最后更新时间"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
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
          bizdataId: 0,
          testdriver: '',
          bizkey: '',
          bizname: '',
          bizvalue: '',
          parentbizkey: '',
          parentbizvalue: '',
          status: '',
          updatedAt: '',
          orderNumber: ''
        },
        dataRule: {
          testdriver: [
            { required: true, message: '测试驱动不能为空', trigger: 'blur' }
          ],
          bizkey: [
            { required: true, message: 'Key不能为空', trigger: 'blur' }
          ],
          bizname: [
            { required: true, message: 'Name不能为空', trigger: 'blur' }
          ],
          bizvalue: [
            { required: true, message: 'Value不能为空', trigger: 'blur' }
          ],
          parentbizkey: [
            { required: true, message: '父Key不能为空', trigger: 'blur' }
          ],
          parentbizvalue: [
            { required: true, message: '父Value不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          updatedAt: [
            { required: true, message: '最后更新时间不能为空', trigger: 'blur' }
          ],
          orderNumber: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.bizdataId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.bizdataId) {
            API.componentbizdata.info(this.dataForm.bizdataId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.testdriver = data.componentbizdata.testdriver
                this.dataForm.bizkey = data.componentbizdata.bizkey
                this.dataForm.bizname = data.componentbizdata.bizname
                this.dataForm.bizvalue = data.componentbizdata.bizvalue
                this.dataForm.parentbizkey = data.componentbizdata.parentbizkey
                this.dataForm.parentbizvalue = data.componentbizdata.parentbizvalue
                this.dataForm.status = data.componentbizdata.status
                this.dataForm.updatedAt = data.componentbizdata.updatedAt
                this.dataForm.orderNumber = data.componentbizdata.orderNumber
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
              'bizdataId': this.dataForm.bizdataId || undefined,
              'testdriver': this.dataForm.testdriver,
              'bizkey': this.dataForm.bizkey,
              'bizname': this.dataForm.bizname,
              'bizvalue': this.dataForm.bizvalue,
              'parentbizkey': this.dataForm.parentbizkey,
              'parentbizvalue': this.dataForm.parentbizvalue,
              'status': this.dataForm.status,
              'updatedAt': this.dataForm.updatedAt,
              'orderNumber': this.dataForm.orderNumber
            }
            var tick = !this.dataForm.bizdataId ? API.componentbizdata.add(params) : API.componentbizdata.update(params)
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
