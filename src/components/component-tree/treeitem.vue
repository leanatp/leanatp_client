<template>
  <div class="tree_warpper">
    <template v-for="item in treeList" v-if="treeList&&treeList.length>0">              
        <el-submenu :key="item.nodeUuid" 
          :data-idx="lvlIndex + item.nodeUuid"
          :index="lvlIndex + item.nodeUuid"             
          slot="title"
          
        >
          <template slot="title">
            <icon-svg :name="item|getIconName" class="site-sidebar__menu-icon"></icon-svg>
            <span class="testcss" >{{item.nodeName}}</span>
          </template>
          <template v-for="child in item.children" >
            <TreeItem v-if="child.children&&child.children.length>0" :is-nest="false"  :lvlIndex="lvlIndex+1"  :treeList="[child]" :key="child.nodeUuid" @node-selected="treeNodeClickHandler"></TreeItem>
            <el-menu-item v-else :index="lvlIndex+''" :data-index="lvlIndex+child.nodeUuid" :key="child.nodeUuid" class='testcss' @click="treeNodeClickHandler(child)" >
              <icon-svg :name="child.iconName" class="site-sidebar__menu-icon"></icon-svg>
              <span>{{child.nodeName}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
    </template>
    </div>
</template>

<script>
export default {
  name: "TreeItem",
  props: {
    treeList: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    },
    lvlIndex: {
      type: Number,
      default: 1
    }
  },
  filters:{
    getIconName(node){
      return node.iconName
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    treeNodeClickHandler(node)
    {
      this.$emit('node-selected', node)
    }
  }
};
</script>
<style>
.testcss {
  height: 30px !important;
  max-height: 30px !important;
  line-height: 30px !important;
}
.el-submenu__tree {
  height: 30px !important;
  max-height: 30px !important;
  line-height: 30px !important;
}
</style>



