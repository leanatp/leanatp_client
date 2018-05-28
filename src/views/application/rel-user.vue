<template>
<el-dialog
  title="关联用户"  
  :close-on-click-modal="false"
  :visible.sync="visible" class="dlg-text-centre dlg-body">
<div class="ctrl-userlist-selected" v-show="selectUserListVisible">
  <div class="ctrl-userlist-selected-title">已选择用户</div>
  <el-tag
    v-for="selectUser in selectedUsers"
    :key="selectUser.username"
    closable
    type="success"
    @close="handleClose(selectUser)"
    >
    {{selectUser.username}}
  </el-tag>
</div>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="addToSelectedUsers()">添加</el-button>
        <el-button @click="saveData()" v-show="saveBtnVisible" type="primary">保存</el-button>
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
        prop="userId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>   
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[5]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</el-dialog>
</template>

<script>
import API from "@/api"

export default {
  data() {
    return {
      dataForm: {
        userName: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      visible: false,
      selectedUsers: [],
      selectUserListVisible: false,
      saveBtnVisible: false,
      keyID: ""
    };
  },
  components: {},
  activated() {
    this.getDataList();
  },
  methods: {
    init(id, uuid) {
      this.visible = true
      this.keyID = id
      this.keyUUID = uuid
      this.dataListSelections = []
      this.dataList = []
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        username: this.dataForm.userName,
        applicationId: this.keyID,
        applicationUUID: this.keyUUID
      };
      API.user.applicationUserlist(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.selectedUsers = data.users;
          if (this.selectedUsers.length > 0) {
            this.selectUserListVisible = this.saveBtnVisible = true;
          }
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        username: this.dataForm.userName,
        applicationid: this.keyID
      };
      API.user.list(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    addToSelectedUsers() {
      var ls = []
      this.dataListSelections.forEach((user, index) => {
        var isHas = false
        for(var i=0;i<this.selectedUsers.length;i++)
        {
          if(this.selectedUsers[i].userId === user.userId)
          {
            isHas = true
          }
        }
        if(!isHas)
        {
          ls.push(user)
        }
      });
      if(ls.length > 0)
      {
        ls.forEach((u, index)=>{
          this.selectedUsers.push(u)
        })
      }
      this.selectUserListVisible = true;
      this.saveBtnVisible = true;
    },
    handleClose(tag) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(tag), 1);
      if (this.selectedUsers.length === 0) {
        this.selectUserListVisible = false;
        this.saveBtnVisible = false;
      }
    },
    saveData() {
      var datas = [];
      this.selectedUsers.forEach((user, index) => {
        var obj = {
          applicationId: this.keyID,
          applicationUuid: this.keyUUID,
          userId: user.userId,
          userUuid: ""
        };
        datas.push(obj);
      });
      API.relapplicationuser.saveRels(datas).then(({ data }) => {
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
          this.$message.error(data.msg)
        }
      });
    }
  }
};
</script>
<style>
.dlg-body .el-dialog .el-dialog__body {
  padding-top: 5px !important;
}
.ctrl-userlist-selected {
  padding-top: 15px;
  padding-bottom: 15px;
}
.ctrl-userlist-selected-title {
  padding-bottom: 6px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>


