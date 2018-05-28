<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="排序号" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber" placeholder="排序号"></el-input>
      </el-form-item>
      <el-form-item label="组件编号" prop="componentCode">
        <el-input v-model="dataForm.componentCode" placeholder="组件编号"></el-input>
      </el-form-item>
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="dataForm.componentName" placeholder="组件名称"></el-input>
      </el-form-item>
      <el-form-item label="组件类型" prop="componentType">
        <el-select v-model="dataForm.componentType" placeholder="请选择">
          <el-option
            v-for="item in componentTypeList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue">
          </el-option>
        </el-select>
      </el-form-item>   

      <el-form-item label="父节点ID" prop="parentId">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="treeList"
            :props="treeListTreeProps"
            node-key="categoryId"
            ref="menuListTree"
            @current-change="treeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择业务组件" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.bizvalue"
            :label="item.bizname"
            :value="item.bizvalue"
            >
          </el-option>
        </el-select>
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
  import { treeDataTranslateForCategory, getTick4Category} from "@/utils";
  export default {
    data () {
      return {
        visible: false,
        componentTypeList: [],
        statusList: [],
        dataForm: {
          componentId: 0,
          componentUuid: '',
          categoryUuid: '',
          categoryId: '',
          componentCode: '',
          componentName: '',
          orderNumber: '',
          updatedAt: '',          
          parentComponentid: '',
          parentComponentuuid: '',
          status: '',
          componentType: '',
          parentName: ''
        },
        treeList: [],
        treeListTreeProps: {
          label: "categoryName",
          children: "children"
        },
        selectedNode : null,
        dataRule: {
          componentCode: [
            { required: true, message: '组件编号不能为空', trigger: 'blur' }
          ],
          componentName: [
            { required: true, message: '组件名称不能为空', trigger: 'blur' }
          ],
          orderNumber: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          componentType: [
            { required: true, message: '组件类型不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '请选择父组件', trigger: 'blue'}
          ]
        }
      }
    },
    methods: {
      refAddCtrl(){
        
      },
      init (id) {
        this.dataForm.componentId = 0
        this.visible = true
        this.statusList = this.componentTypeList = []
        API.componentbizdata.querykey("ComponentType")
        .then(({data})=>{
          this.componentTypeList = data && data.code === 0 ? data.items : [];
        })
        .then(()=>{
          API.sysbizdata.querykey("ComponentStatus").then(({data})=>{
            this.statusList = data && data.code === 0 ? data.items : [];
          })
        })
        .then(()=>{
          var tick = getTick4Category(API, "component")
          tick.listall()
          .then(({data})=>{
            this.treeList = treeDataTranslateForCategory(data,"categoryId")
            })
        })
        .then(()=>{
           this.$refs["dataForm"].resetFields();
        })
      },
      // 菜单树选中
      treeListTreeCurrentChangeHandle(data, node) {      
        this.dataForm.parentId = data.categoryId;
        this.dataForm.parentUuid = data.categoryUuid;
        this.dataForm.parentName = data.categoryName;
        this.selectedNode = node;
      },
      // 菜单树设置当前选中节点
      treeListTreeSetCurrentNode() {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentUuid);
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
          {})["name"];
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {           
            var params = {
              'componentId': undefined,
              'categoryId': this.dataForm.parentId,
              'categoryUuid': this.dataForm.parentUuid,
              'componentCode': this.dataForm.componentCode,
              'componentName': this.dataForm.componentName,
              'orderNumber': this.dataForm.orderNumber,          
              'parentComponentid': undefined,
              'parentComponentuuid': undefined,
              'status': this.dataForm.status,
              'componentType': this.dataForm.componentType
            }
            var tick = !this.dataForm.componentId ? API.component.add(params) : API.component.update(params)
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
