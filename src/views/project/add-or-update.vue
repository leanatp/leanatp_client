<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="项目名称" prop="projectname">
        <el-input v-model="dataForm.projectname" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="项目状态" prop="projectStatus">
        <el-input v-model="dataForm.projectStatus" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder=""></el-input>
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
          projectname: '',
          projectStatus: '',
          description: ''
        },
        dataRule: {
          projectname: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          projectStatus: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createdAt: [
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
            API.project.info(this.dataForm.projectId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectname = data.project.projectname
                this.dataForm.projectStatus = data.project.projectStatus
                this.dataForm.description = data.project.description
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
              'projectname': this.dataForm.projectname,
              'projectStatus': this.dataForm.projectStatus,
              'description': this.dataForm.description,
              'createdAt': this.dataForm.createdAt,
              'projectUuid': this.dataForm.projectUuid
            }
            var tick = !this.dataForm.projectId ? API.project.add(params) : API.project.update(params)
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
