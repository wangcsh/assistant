<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="param.weDepartment" :placeholder="'部门'" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in searchNoList" :key="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="param.dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="come开始日期"
        end-placeholder="come结束日期"
        format=""
        class="filter-item"
      />
      <el-date-picker
        v-model="param.leavedateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="leave开始日期"
        end-placeholder="leave结束日期"
        format=""
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="param.pageNum"
      :limit.sync="param.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getPage, getAllDepartmentList } from '@/api/table'
import Pagination from '@/components/Pagination'
export default {
  name: 'UserIndex',
  components: { Pagination },
  data() {
    return {
      list: null,
      searchNoList: [],
      param: {
        weDepartment: '',
        pageNum: 1,
        pageSize: 20,
        dateRange: null,
        startDate: '',
        endDate: '',
        leavedateRange: null,
        leaveStartDate: '',
        leaveEndDate: ''
      },
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getAllDepartmentList().then((response) => {
        this.searchNoList = response.data
      })
    },
    search() {
      this.param.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      if (this.param.dateRange && this.param.dateRange.length > 0) {
        this.param.startDate = this.param.dateRange[0] + ' 00:00:00' || ''
        this.param.endDate = this.param.dateRange[1] + ' 23:59:59' || ''
      } else {
        this.param.startDate = ''
        this.param.endDate = ''
      }
      if (this.param.leavedateRange && this.param.leavedateRange.length > 0) {
        this.param.leaveStartDate = this.param.leavedateRange[0] + ' 00:00:00' || ''
        this.param.leaveEndDate = this.param.leavedateRange[1] + ' 23:59:59' || ''
      } else {
        this.param.leaveStartDate = ''
        this.param.leaveEndDate = ''
      }
      getPage(this.param).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
