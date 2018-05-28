<template>
  <el-menu mode="vertical" @click="openHandler"  :default-active="$route.path"  background-color="#ffffff" text-color="#000000" active-text-color="#409EFF">
      <TreeItem :treeList="treeList" :lvlIndex="lvlIndex" :unique-opened="false" @node-selected="treeNodeClickedHandler" 
       
      ></TreeItem>
    </el-menu>
</template>


<script>
import TreeItem from './treeitem'
export default{
    components: {
      TreeItem
    },
    name: 'component-treeview',
    props: {
    treeList: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    },
    lvlIndex:{
        type: Number,
        default:1
    }
    
  },
  methods:{
      treeviewCollapse(){

      },
      treeNodeClickedHandler(node){
          this.$emit('node-selected', node)
      },
      openHandler(node,node1,node2){
        console.log('in')
        
      }
    }  

}

</script>