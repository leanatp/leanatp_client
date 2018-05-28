<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字段Key" prop="bizkey">
        <el-input v-model="dataForm.bizkey" placeholder="字段Key"></el-input>
      </el-form-item>
      <el-form-item label="字段Name" prop="bizvalue">
        <el-input v-model="dataForm.bizvalue" placeholder="字段Name"></el-input>
      </el-form-item>
      <el-form-item label="字段Value" prop="bizvalue">
        <el-input v-model="dataForm.bizvalue" placeholder="字段Value"></el-input>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
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
          bizkey: '',
          bizvalue: '',
          status: 1,
          createdAt: ''
        },
        dataRule: {
          bizkey: [
            { required: true, message: '字段Key不能为空', trigger: 'blur' }
          ],
          bizvalue: [
            { required: true, message: '字段Value不能为空', trigger: 'blur' }
          ],
          bizname: [
            { required: true, message: '字段Name不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
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
            API.sysbizdata.info(this.dataForm.bizdataId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bizkey = data.sysBizdata.bizkey
                this.dataForm.bizvalue = data.sysBizdata.bizvalue
                this.dataForm.bizname = data.sysBizdata.bizname
                this.dataForm.status = data.sysBizdata.status   
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
              'bizkey': this.dataForm.bizkey,
              'bizvalue': this.dataForm.bizvalue,
              'bizname': this.dataForm.bizname,
              'status': this.dataForm.status              
            }
            var tick = !this.dataForm.bizdataId ? API.sysbizdata.add(params) : API.sysbizdata.update(params)
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
