<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-input v-model="filterText" auto-complete placeholder="输入关键字进行过滤" @focus="focus($event)" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="height: 97vh;">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="dataTree"
          highlight-current
          node-key="id"
          :props="defaultProps"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="comm('setKey',data)">set</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
<script>
export default {
  name: 'ChangeTree',
  data() {
    return {
      filterText: '',
      objType: '',
      keyValue: '',
      dialogVisible: false,
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
  },
  methods: {
    focus(event) {
      event.currentTarget.select()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    comm(eventName, data) {
      this.$emit(eventName, JSON.parse(JSON.stringify(data)))
    },
    changeTree(data) {
      this.dataTree = []
      if (data) { // data 不为空
        const tempDataTree = data.sort()
        tempDataTree.forEach((vv) => {
          const split = vv.split(':')
          this.addDataTree(this.dataTree, split)
        })
      } else {
        this.$message.warning('数据为空！')
      }
      console.log(this.dataTree.length)
    },
    addDataTree(tree, oneline, id) {
      if (!oneline) { // 空 处理
        return
      }
      if (oneline.length === 0) { // 空处理
        return
      }

      var oneObj = oneline[0]
      for (var objIndex in tree) {
        var objectTree = tree[objIndex]
        if (objectTree.label === oneObj) { // 树中已经存在oneline的 key
          var newOneline = JSON.parse(JSON.stringify(oneline))
          newOneline.shift()
          this.addDataTree(objectTree.children, newOneline, objectTree.id)
          return
        }
      }
      // tree 中不在 label 为 oneline的 数据 添加进树中。
      var newId = oneObj
      if (id) {
        newId = id + ':' + oneObj
      }
      var treeObj = { 'id': newId, 'label': oneObj, children: [] }
      tree.push(treeObj)
      var newOnelineTemp = JSON.parse(JSON.stringify(oneline))
      newOnelineTemp.shift()
      this.addDataTree(treeObj.children, newOnelineTemp, treeObj.id)
    }
  }
}
</script>
<!--{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }-->
