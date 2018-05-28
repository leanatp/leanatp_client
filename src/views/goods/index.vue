<template>
  <div id="app" style="container">
    <div class="col-md-10 col-md-offset-1">
      <div class="page-header">
        <h3>基于Vue的组织架构树组件</h3>
      </div>
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <form class="form-horizontal row">
            <div class="col-md-3">
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="horizontal" > horizontal
                </label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="collapsable"> collapsable
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="control-label col-md-5">labelClassName:</label>
                <div class="col-md-7">
                  <select class="form-control" v-model="labelClassName">
                    <option value="bg-white">bg-white</option>
                    <option value="bg-orange">bg-orange</option>
                    <option value="bg-gold">bg-gold</option>
                    <option value="bg-gray">bg-gray</option>
                    <option value="bg-lightpink">bg-lightpink</option>
                    <option value="bg-chocolate">bg-chocolate</option>
                    <option value="bg-tomato">bg-tomato</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <p><br></p>
      <div class="text-center">
        <org-tree
          :data="data"
          :horizontal="horizontal"
          :collapsable="collapsable"
          :label-class-name="labelClassName"
          :render-content="renderContent"
          @on-expand="onExpand"
          @on-node-click="onNodeClick"
        >
        </org-tree>
      </div>
    </div>
  </div>
</template>

<script>
import OrgTree from './components/org-tree/org-tree.vue'

export default {
  name: 'app1',
  components: {
    OrgTree
  },
  data () {
    return {
      data: {},
      horizontal: false,
      collapsable: true,
      labelClassName: 'bg-white'
    }
  },
created(){
let ls = [{
id: 1,
label: "label1"
},
{
id: 2,
label: "label2"
},
{
id: 3,
label: "label3"
}
]
let temp = {}
if(ls.length === 0)
return temp
temp = ls[0]
let _node = temp
for(var i=1;i<ls.length;i++){
_node.children = [ls[i]]
_node = _node.children[0]
}
console.log(temp)
this.data = temp
},
  methods: {
    getdata(){
      this.data = {
        id: 0,
        label: 'XXX科技有限公司',
        guid: "asdfasf",
        children: [{
          id: 2,
          label: '产品研发部',
          children: [{
            id: 5,
            label: '研发-前端'
          }, {
            id: 6,
            label: '研发-后端'
          }, {
            id: 9,
            label: 'UI设计'
          }, {
            id: 10,
            label: '产品经理'
          }]
        }, {
          id: 3,
          label: '销售部',
          children: [{
            id: 7,
            label: '销售一部'
          }, {
            id: 8,
            label: '销售二部'
          }]
        }, {
          id: 4,
          label: '财务部'
        }, {
          id: 9,
          label: 'HR人事'
        }]
      }
    },
    renderContent (h, data) {
      return data.label
    },
    onExpand (data) {
      if ('expand' in data) {
        data.expand = !data.expand

        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick (e, data) {
      this.data = {
        id: 0,
        label: 'XXX科技有限公司1',
        guid: "asdfasf",
        children: [{
          id: 2,
          label: '产品研发部',
          children: [{
            id: 5,
            label: '研发-前端'
          }]
        }, {
          id: 3,
          label: '销售部',
          children: [{
            id: 7,
            label: '销售一部'
          }, {
            id: 8,
            label: '销售二部'
          }]
        }, {
          id: 4,
          label: '财务部'
        }, {
          id: 9,
          label: 'HR人事'
        }]
      }
    },
    collapse (list) {
      list.forEach(child => {
        if (child.expand) {
          child.expand = false
        }

        child.children && this.collapse(child.children)
      })
    }
  }
}
</script>
<style>
.bg-white {
background-color: white;
}
.bg-orange {
background-color: orange;
}
.bg-gold {
background-color: gold;
}
.bg-gray {
background-color: gray;
}
.bg-lightpink {
background-color: lightpink;
}
.bg-chocolate {
background-color: chocolate;
}
.bg-tomato {
background-color: tomato;
}
.org-tree-container {
display: inline-block;
padding: 15px;
background-color: #fff;
}
.org-tree {
display: table;
text-align: center;
}
.org-tree:before,
.org-tree:after {
content: '';
display: table;
}
.org-tree:after {
clear: both;
}
.org-tree-node,
.org-tree-node-children {
position: relative;
margin: 0;
padding: 0;
list-style-type: none;
}
.org-tree-node:before,
.org-tree-node-children:before,
.org-tree-node:after,
.org-tree-node-children:after {
transition: all .35s;
}
.org-tree-node-label {
position: relative;
display: inline-block;
}
.org-tree-node-label .org-tree-node-label-inner {
padding: 10px 15px;
text-align: center;
border-radius: 3px;
box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.org-tree-node-btn {
position: absolute;
top: 100%;
left: 50%;
width: 20px;
height: 20px;
z-index: 10;
margin-left: -11px;
margin-top: 9px;
background-color: #fff;
border: 1px solid #ccc;
border-radius: 50%;
box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
cursor: pointer;
transition: all .35s ease;
}
.org-tree-node-btn:hover {
background-color: #e7e8e9;
transform: scale(1.15);
}
.org-tree-node-btn:before,
.org-tree-node-btn:after {
content: '';
position: absolute;
}
.org-tree-node-btn:before {
top: 50%;
left: 4px;
right: 4px;
height: 0;
border-top: 1px solid #ccc;
}
.org-tree-node-btn:after {
top: 4px;
left: 50%;
bottom: 4px;
width: 0;
border-left: 1px solid #ccc;
}
.org-tree-node-btn.expanded:after {
border: none;
}
.org-tree-node {
padding-top: 20px;
}
.org-tree-node:not(:only-child) {
float: left;
}
.org-tree-node.is-leaf,
.org-tree-node.collapsed {
padding-left: 10px;
padding-right: 10px;
}
.org-tree-node:before,
.org-tree-node:after {
content: '';
position: absolute;
top: 0;
left: 0;
width: 50%;
height: 19px;
}
.org-tree-node:after {
left: 50%;
border-left: 1px solid #ddd;
}
.org-tree-node:not(:first-child):before,
.org-tree-node:not(:last-child):after {
border-top: 1px solid #ddd;
}
.collapsable .org-tree-node.collapsed {
padding-bottom: 30px;
}
.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
content: '';
position: absolute;
top: 100%;
left: 0;
width: 50%;
height: 20px;
border-right: 1px solid #ddd;
}
.org-tree > .org-tree-node {
padding-top: 0;
}
.org-tree > .org-tree-node:after {
border-left: 0;
}
.org-tree-node-children {
padding-top: 20px;
}
.org-tree-node-children:before {
content: '';
position: absolute;
top: 0;
left: 50%;
width: 0;
height: 20px;
border-left: 1px solid #ddd;
}
.org-tree-node-children:after {
content: '';
display: table;
clear: both;
}
.horizontal .org-tree-node {
display: table-cell;
float: none;
padding-top: 0;
padding-left: 20px;
}
.horizontal .org-tree-node.is-leaf,
.horizontal .org-tree-node.collapsed {
padding-top: 10px;
padding-bottom: 10px;
}
.horizontal .org-tree-node:before,
.horizontal .org-tree-node:after {
width: 19px;
height: 50%;
}
.horizontal .org-tree-node:after {
top: 50%;
left: 0;
border-left: 0;
}
.horizontal .org-tree-node:only-child:before {
border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:first-child):before,
.horizontal .org-tree-node:not(:last-child):after {
border-top: 0;
border-left: 1px solid #ddd;
}
.horizontal .org-tree-node:not(:only-child):after {
border-top: 1px solid #ddd;
}
.horizontal .org-tree-node .org-tree-node-inner {
display: table;
}
.horizontal .org-tree-node-label {
display: table-cell;
vertical-align: middle;
}
.horizontal.collapsable .org-tree-node.collapsed {
padding-right: 30px;
}
.horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
top: 0;
left: 100%;
width: 20px;
height: 50%;
border-right: 0;
border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node-btn {
top: 50%;
left: 100%;
margin-top: -11px;
margin-left: 9px;
}
.horizontal > .org-tree-node:only-child:before {
border-bottom: 0;
}
.horizontal .org-tree-node-children {
display: table-cell;
padding-top: 0;
padding-left: 20px;
}
.horizontal .org-tree-node-children:before {
top: 50%;
left: 0;
width: 20px;
height: 0;
border-left: 0;
border-top: 1px solid #ddd;
}
.horizontal .org-tree-node-children:after {
display: none;
}
.horizontal .org-tree-node-children > .org-tree-node {
display: block;
}
</style>

