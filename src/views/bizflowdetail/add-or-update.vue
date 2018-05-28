<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="" prop="bizflowdetailUuid">
        <el-input v-model="dataForm.bizflowdetailUuid" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="bizflowId">
        <el-input v-model="dataForm.bizflowId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="bizflowUuid">
        <el-input v-model="dataForm.bizflowUuid" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="componentId">
        <el-input v-model="dataForm.componentId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="componentUuid">
        <el-input v-model="dataForm.componentUuid" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
      </el-form-item>
      <el-form-item label="" prop="updatedAt">
        <el-input v-model="dataForm.updatedAt" placeholder=""></el-input>
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
  import API from '@/api'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          bizflowdetailId: 0,
          bizflowdetailUuid: '',
          bizflowId: '',
          bizflowUuid: '',
          componentId: '',
          componentUuid: '',
          orderNumber: '',
          updatedAt: '',
          description: ''
        },
        dataRule: {
          bizflowdetailUuid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          bizflowId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          bizflowUuid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          componentId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          componentUuid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          orderNumber: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ],
          updatedAt: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.bizflowdetailId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.bizflowdetailId) {
            API.bizflowdetail.info(this.dataForm.bizflowdetailId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bizflowdetailUuid = data.bizflowdetail.bizflowdetailUuid
                this.dataForm.bizflowId = data.bizflowdetail.bizflowId
                this.dataForm.bizflowUuid = data.bizflowdetail.bizflowUuid
                this.dataForm.componentId = data.bizflowdetail.componentId
                this.dataForm.componentUuid = data.bizflowdetail.componentUuid
                this.dataForm.orderNumber = data.bizflowdetail.orderNumber
                this.dataForm.updatedAt = data.bizflowdetail.updatedAt
                this.dataForm.description = data.bizflowdetail.description
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
              'bizflowdetailId': this.dataForm.bizflowdetailId || undefined,
              'bizflowdetailUuid': this.dataForm.bizflowdetailUuid,
              'bizflowId': this.dataForm.bizflowId,
              'bizflowUuid': this.dataForm.bizflowUuid,
              'componentId': this.dataForm.componentId,
              'componentUuid': this.dataForm.componentUuid,
              'orderNumber': this.dataForm.orderNumber,
              'updatedAt': this.dataForm.updatedAt,
              'description': this.dataForm.description
            }
            var tick = !this.dataForm.bizflowdetailId ? API.bizflowdetail.add(params) : API.bizflowdetail.update(params)
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
