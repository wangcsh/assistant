<template>
  <div class="app-container">
    <!-- <pre>{{list}}</pre> -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="weName" prop="weName" />
      <el-table-column label="staffid" prop="id" />
      <el-table-column label="weDepartment" align="center" prop="weDepartment" />
      <el-table-column label="comeTime" align="center" prop="comeTime" />
      <el-table-column align="center" prop="leaveTime" label="leaveTime" width="300" />
    </el-table>
  </div>
</template>

<script>
import { getPage } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      param: {
        pageNum: 1,
        pageSize: 20
      },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPage(this.param).then(response => {
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
