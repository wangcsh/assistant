<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="cookie">
              <el-input v-model="form.cookie" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary" @click="onSync()">sync</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
          <el-row>
            <pre>{{ list }}</pre>
          </el-row>
        </el-card></el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <el-form ref="form" :model="recordForm" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="recordForm.date" />
            </el-form-item>
            <el-form-item label="staffid">
              <el-input v-model="recordForm.staffid" />
            </el-form-item>
            <el-form-item label="cookie">
              <el-input v-model="recordForm.cookie" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onRecord">record</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
          <el-row>
            <pre>{{ recordShow }}</pre>
          </el-row>
        </el-card></el-col>
    </el-row>

  </div>
</template>

<script>
import { getUserNameInfo, getRecord, syncNewPerson } from '@/api/user'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      form: {
        name: '高杰',
        cookie: 'PHPSESSID=ufu4vl730jqijcmgig3i71mng2'
      },
      recordForm: {
        date: '21-10',
        staffid: '538521',
        cookie: 'PHPSESSID=ufu4vl730jqijcmgig3i71mng2'
      },
      recordShow: null
    }
  },
  created() {},
  methods: {
    onSubmit() {
      getUserNameInfo(this.form).then((response) => {
        this.list = response
        console.log(response)
      })
    },
    onRecord() {
      getRecord(this.recordForm).then((response) => {
        this.recordShow = response
        console.log(response)
      })
    },
    onSync() {
      syncNewPerson(this.form).then((response) => {
        this.list = response
        console.log(response)
      })
    }
  }
}
</script>
