<template>
  <div>
    <el-bigdata-table
      highlight-current-row
      ref="singleTable"
      :data="tableData"
      :height="750"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="date"
        label="日期"
        width="120">
      </el-table-column>
      <el-table-column
        property="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="address"
        label="地址">
      </el-table-column>
    </el-bigdata-table>
  </div>
</template>

<script>
  import ElBigdataTable from './vue-element-bigdata-table';
  export default {
    components: {
      ElBigdataTable
    },
    data () {
      return {
      }
    },
    computed: {
      tableData () {
        let data = [];
        for (let i = 0; i < 10000; i++) {
          data.push({
            date: '2016-05-02',
            name: '王小虎' + i,
            address: '上海市普陀区金沙江路 1518 弄'
          });
        }
        return data;
      }
    }
  }
</script>
<style>
.current-row td{font-weight: bold; background-color: #fefefe;}
</style>
