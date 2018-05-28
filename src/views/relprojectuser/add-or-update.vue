<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="" prop="projectUuid">
        <el-input v-model="dataForm.projectUuid" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="userId">
        <el-input v-model="dataForm.userId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="userUuid">
        <el-input v-model="dataForm.userUuid" placeholder=""></el-input>
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
          projectId: 0,
          projectUuid: '',
          userId: '',
          userUuid: ''
        },
        dataRule: {
          projectUuid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          userUuid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.projectId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.projectId) {
            API.relprojectuser.info(this.dataForm.projectId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectUuid = data.relprojectuser.projectUuid
                this.dataForm.userId = data.relprojectuser.userId
                this.dataForm.userUuid = data.relprojectuser.userUuid
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
              'projectId': this.dataForm.projectId || undefined,
              'projectUuid': this.dataForm.projectUuid,
              'userId': this.dataForm.userId,
              'userUuid': this.dataForm.userUuid
            }
            var tick = !this.dataForm.projectId ? API.relprojectuser.add(params) : API.relprojectuser.update(params)
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
