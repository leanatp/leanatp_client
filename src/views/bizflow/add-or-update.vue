<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="UUID" prop="bizflowUuid">
        <el-input v-model="dataForm.bizflowUuid" placeholder="UUID"></el-input>
      </el-form-item>
      <el-form-item label="所属目录ID" prop="categoryId">
        <el-input v-model="dataForm.categoryId" placeholder="所属目录ID"></el-input>
      </el-form-item>
      <el-form-item label="所属目录UUID" prop="categroyUuid">
        <el-input v-model="dataForm.categroyUuid" placeholder="所属目录UUID"></el-input>
      </el-form-item>
      <el-form-item label="业务流名称" prop="bizflowName">
        <el-input v-model="dataForm.bizflowName" placeholder="业务流名称"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="updatedAt">
        <el-input v-model="dataForm.updatedAt" placeholder=""></el-input>
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
          bizflowId: 0,
          bizflowUuid: '',
          categoryId: '',
          categroyUuid: '',
          bizflowName: '',
          status: '',
          description: '',
          orderNumber: '',
          updatedAt: ''
        },
        dataRule: {
          bizflowUuid: [
            { required: true, message: 'UUID不能为空', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '所属目录ID不能为空', trigger: 'blur' }
          ],
          categroyUuid: [
            { required: true, message: '所属目录UUID不能为空', trigger: 'blur' }
          ],
          bizflowName: [
            { required: true, message: '业务流名称不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          orderNumber: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updatedAt: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.bizflowId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.bizflowId) {
            API.bizflow.info(this.dataForm.bizflowId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bizflowUuid = data.bizflow.bizflowUuid
                this.dataForm.categoryId = data.bizflow.categoryId
                this.dataForm.categroyUuid = data.bizflow.categroyUuid
                this.dataForm.bizflowName = data.bizflow.bizflowName
                this.dataForm.status = data.bizflow.status
                this.dataForm.description = data.bizflow.description
                this.dataForm.orderNumber = data.bizflow.orderNumber
                this.dataForm.updatedAt = data.bizflow.updatedAt
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
              'bizflowId': this.dataForm.bizflowId || undefined,
              'bizflowUuid': this.dataForm.bizflowUuid,
              'categoryId': this.dataForm.categoryId,
              'categroyUuid': this.dataForm.categroyUuid,
              'bizflowName': this.dataForm.bizflowName,
              'status': this.dataForm.status,
              'description': this.dataForm.description,
              'orderNumber': this.dataForm.orderNumber,
              'updatedAt': this.dataForm.updatedAt
            }
            var tick = !this.dataForm.bizflowId ? API.bizflow.add(params) : API.bizflow.update(params)
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
