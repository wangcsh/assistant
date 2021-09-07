<template>
  <div class="app-container">
    <pre>{{list}}</pre>
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
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
