<template>
<el-container style="height: auto; ">
  <el-aside width="25%" style="background-color: white;">
      <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="0px">
           <el-form-item>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addHandle()">新增</el-button>        
      </el-form-item>
    <el-form-item size="mini">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="categoryId"
          ref="menuListTree"
          :default-expand-all="true"
          @node-click="treeNodeClick"
          >
        </el-tree>
      </el-form-item>
      </el-form>
  </el-aside>  
  <el-container>   
    <el-main>
      <Update v-if="updateVisible" ref="Update" @refreshTreeView="refreshTreeView"  ></Update>      
    </el-main>
  </el-container>
  <Add v-if="addVisible" ref="Add" @refreshTreeView="refreshTreeView" ></Add>
</el-container>  

</template>


<style>
.el-aside {
  color: #333;
}
</style>

<script>
import API from "@/api";
import { treeDataTranslateForCategory, getTick4Category } from "@/utils";
import Add from "@/components/category-node/add.vue";
import Update from "@/components/category-node/update.vue";

export default {
  data() {
    return {
      menuList: [],
      menuListTreeProps: {
        label: "categoryName",
        children: "children"
      },
      tempKey: -666666,
      categoryType:'',
      dataForm: {
        id: 0
      },
      updateVisible: false,
      addVisible: false
    };
  },
  activated() {
    //this.init();
  },
  components: {
    Update,
    Add
  },
  methods: {
    init(id, categoryType) {
      this.dataForm.id = id || 0;
      this.categoryType = categoryType
      var tick = getTick4Category(API, this.categoryType) 
      tick
        .listall()
        .then(({ data }) => {
          this.menuList = treeDataTranslateForCategory(data, "categoryId");
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
            this.$refs.menuListTree.setCheckedKeys([]);
          });
        });
    },
    treeNodeClick(node) {
      if (node.categoryId != 0) {
        this.updateVisible = true;
        this.$nextTick(() => {
          this.$refs.Update.init(node.categoryId, this.categoryType);
        });
      } else {
        this.updateVisible = false;
      }
    },
    addHandle() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.Add.init(null, this.categoryType);
      });
    },
    refreshTreeView() {
      this.menuList = [];
      var tick = getTick4Category(API, this.categoryType) 
      tick.listall().then(({ data }) => {
        this.menuList = treeDataTranslateForCategory(data, "categoryId");
      });
      this.updateVisible = false;
    }
  }
};
</script>