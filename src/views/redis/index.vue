<template>
  <el-container>
    <el-aside style="width: 20%;background-color:#fce38a;">
      <el-button type="primary" size="mini" @click="sendScanKey">查询*</el-button>
      <change-tree ref="allKeyChangeTree" @setKey="setKeyByAll" />
    </el-aside>
    <el-aside style="width: 30%;">
      <el-input v-model="treeKey" style="width:70%" @keyup.enter.native="sendTreeKey" @focus="focus($event)" />
      <el-input
        v-model="treeCount"
        style="width:15%"
        @keyup.enter.native="sendTreeKey"
        @focus="focus($event)"
      />

      <el-button type="primary" @click="sendTreeKey">执行</el-button>

      <change-tree ref="changeTree" @setKey="setKeyByFromTree" />
    </el-aside>
    <el-main>
      <div>
        <el-button type="text" @click="drawer = true">历史记录</el-button>
      </div>
      <el-autocomplete
        v-model="selectMethodName"
        style="width: 500px"
        class="inline-input"
        clearable
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @focus="focus($event)"
        @select="setKeyMethodName"
      >
        <template slot-scope="{item}">{{ item.label }}</template>
      </el-autocomplete>
      <el-button size="mini" type="primary" @click="send">执行</el-button>
      <el-button size="mini" type="primary" @click="send('aMasterKeyGetValue')">get</el-button>
      <el-button size="mini" type="primary" @click="send('remove')">rm</el-button>
      <el-button size="mini" type="primary" @click="send('type')">type</el-button>
      <el-button size="mini" type="primary" @click="send('exists')">exists</el-button>
      <el-input v-model="params.key" type="textarea" :rows="7" placeholder="请输入内容" autosize />
      <el-divider />
      <json-view :json="keyValue" />
      <el-divider />
    </el-main>
    <el-drawer title="历史记录" :visible.sync="drawer" :direction="'rtl'" :before-close="handleClose" size="57%">
      <el-table :data="history" size="mini" stripe border :row-class-name="tableRowClassName">
        <el-table-column type="index" label="时间" width="87px" />
        <el-table-column property="status" label="访问状态" width="97px" />
        <el-table-column property="config.url" label="访问URL" />
        <el-table-column label="参数origin" property="config.params.key" />
        <!--        <el-table-column  label="参数" :formatter="tableColFormater"></el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="refreshHistory(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

  </el-container>
</template>

<script>
import { redis, scan, common, commonHistory } from '@/api/redis'
import ChangeTree from '@/components/Tree'
import JsonView from '@/components/JsonView'

export default {
  name: 'Dashboard',
  components: { ChangeTree, JsonView },
  data() {
    return {
      uniqueKey: 'hello_redis',
      drawer: false,
      mthList: [],
      show: false,
      params: {
        key: ''
      },
      selectMethodName: 'keys',
      keyList: null,
      keyValue: {},
      treeKey: 'a*',
      treeCount: 20,
      uniqueTreeKey: 'uniqueTreeKey',
      history: []
    }
  },
  created() {
  },
  mounted() {
    redis().then(resp => {
      console.log(resp)
      this.mthList = resp.data
    }, (err) => {
      this.$message.error('访问方法列表出现错误！')
      console.log(err)
    }).catch(reason => {
      this.$message.error('异常！！')
      console.log(reason)
    })
    const item = localStorage.getItem(this.uniqueKey)
    if (item) {
      this.history = JSON.parse(item)
    }
    const treeItem = localStorage.getItem(this.uniqueTreeKey)
    if (treeItem) {
      this.treeKey = treeItem
    }
    // this.sendTreeKey()
  },
  destroyed() {
    // if(this.history.length>10){
    localStorage.setItem(this.uniqueKey, JSON.stringify(this.history))
    // }
  },
  methods: {
    handleClose(done) {
      done()
    },
    querySearch(queryString, cb) {
      var restaurants = this.mthList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    tableColFormater(row, col, cell, ind) {
      return JSON.stringify(row.config.params)
    },
    send(method) {
      if (method && typeof method === 'string') {
        this.selectMethodName = method
      }
      common(this.selectMethodName, this.params).then(resp => {
        console.log(resp)
        this.history.unshift(resp)
        // this.history.push(resp);
        if (typeof resp.data.result === 'string' && resp.data.result.indexOf('{') === 0) {
          resp.data.result = JSON.parse(resp.data.result)
        }
        this.keyValue = resp.data
      }).catch(function(error) {
        console.log(error)
        this.$message.error('[' + this.selectMethodName + ']访问异常')
      })
    },
    sendTreeKey() {
      // this.$message.error("[keys]访问异常");
      const scanName = 'scan'
      scan(scanName, { 'key': this.treeKey, 'count': this.treeCount }).then(resp => {
        localStorage.setItem(this.uniqueTreeKey, this.treeKey)
        if (resp.data.result.length > 0) {
          this.$refs.changeTree.changeTree(resp.data.result)
        } else {
          this.$notify({
            title: '提示',
            message: '[' + scanName + ']没有查询到数据！',
            type: 'error',
            position: 'top-left',
            duration: 3000
          })
        }
      }).catch(function(error) {
        console.log('treeKey=', error)
        alert('[' + scanName + ']访问异常')
      })
    },
    sendScanKey() {
      redis('scanxing').then(resp => {
        if (resp.data.result.length > 0) {
          this.$refs.allKeyChangeTree.changeTree(resp.data.result)
        } else {
          this.$notify({
            title: '提示',
            message: '[scanxing]没有查询到数据！',
            type: 'error',
            position: 'top-left',
            duration: 3000
          })
        }
      }).catch(function(error) {
        console.log('treeKey=', error)
        alert('[scanxing]访问异常')
      })
    },
    setKeyMethodName(prm) {
      this.selectMethodName = prm.value
      // TODO 解析参数，设置输入框
      console.log(prm)
      const startIndex = prm.label.indexOf('(') + 1
      const endIndex = prm.label.indexOf(')')
      const argParamStr = prm.label.substring(startIndex, endIndex)
      console.log(argParamStr)
      const argParamSplit = argParamStr.split(',')
      if (argParamSplit.length === 1) {
        console.log(argParamSplit)
      } else if (argParamSplit.length === 2) {
        // this.params.mapkey = "";
      }
    },
    focus(event) {
      event.currentTarget.select()
    },
    setKeyByAll(data) {
      this.treeKey = data.id + (data.children.length > 0 ? '*' : '')
      console.log('setKeyByAll=', data)
    },
    setKeyByFromTree(data) {
      if (data.children.length > 0) {
        this.params.key = data.id + '*'
        // this.send('keys');
      } else {
        this.params.key = data.id
        this.send('aMasterKeyGetValue')
      }
    },
    type(data) {
      this.params.key = data.id
      this.send('type')
    },
    refreshHistory: function(ben) {
      console.log(ben)
      commonHistory(ben.config.url, ben.config.params).then((resp) => {
        ben.data = resp.data
        if (typeof resp.data.result === 'string' && resp.data.result.indexOf('{') === 0) {
          resp.data.result = JSON.parse(resp.data.result)
        }
        this.keyValue = resp.data
        this.drawer = false
      }).catch(function(error) {
        alert(error)
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
  .el-aside {
    margin: 3px;
    padding: 3px;
    background-color: #f38181;
  }

  .el-main {
    background-color: #95e1d3;
    color: #333;
  }

  .warning-row {
    background: oldlace;
  }

  .success-row {
    background: #f0f9eb;
  }
</style>
