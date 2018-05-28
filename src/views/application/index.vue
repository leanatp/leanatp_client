<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('application:application:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('application:application:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>        
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="applicationId"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="applicationName"
        header-align="center"
        align="center"
        label="应用名称">
      </el-table-column>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="当前版本">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="architecture"
        header-align="center"
        align="center"
        label="系统架构">
      </el-table-column>
      <el-table-column
        prop="testDriver"
        header-align="center"
        align="center"
        label="测试驱动">
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="visibletType"
        header-align="center"
        align="center"
        label="应用可见状态">
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        header-align="center"
        align="center"
        label="最后更新时间">
      </el-table-column>
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="relUserListHandle(scope.row.applicationId, scope.row.applicationUuid)">关联用户</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.applicationId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.applicationId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <rel-user v-if="relUserListVisible" ref="relUserList" @refreshDataList="getDataList"></rel-user>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './add-or-update'
  import RelUser from './rel-user'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        relUserListVisible: false        
      }
    },
    components: {
      AddOrUpdate,
      RelUser
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        }
        API.application.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //关联用户
      relUserListHandle(id,uuid)
      {
        this.relUserListVisible = true
        this.$nextTick(() => {
          this.$refs.relUserList.init(id,uuid)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.applicationId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.application.del(ids).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
