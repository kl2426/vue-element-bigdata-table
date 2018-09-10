<template>
  <div>
    <el-bigdata-table
      highlight-current-row
      ref="singleTable"
      :data="tableData"
      :height="750"
      :row-height="38"
      style="width: 100%">
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-table :data="childTableData">
            <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
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
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        property="date"
        label="日期"
        width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" sortable width="120" :show-overflow-tooltip="true"
        :filters="[{text: '王小虎1', value: '王小虎1'}, {text: '王小虎2', value: '王小虎2'}, {text: '王小虎3', value: '王小虎3'}, {text: '王小虎4', value: '王小虎4'}]"
        :filter-method="filterTag"
      >
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
        for (let i = 0; i < 100; i++) {
          data.push({
            date: '2016-05-02',
            name: '王小虎' + 1,
            address: '上海市普陀区金沙江路 1518 弄'
          });
        }
        for (let i = 0; i < 1000; i++) {
          data.push({
            date: '2016-05-02',
            name: '王小虎' + 2,
            address: '上海市普陀区金沙江路 1518 弄'
          });
        }
        for (let i = 0; i < 125; i++) {
          data.push({
            date: '2016-05-02',
            name: '王小虎' + i,
            address: '上海市普陀区金沙江路 1518 弄'
          });
        }
        return data;
      },
      childTableData () {
        let data = [];
        for (let i = 0; i < 10; i++) {
          data.push({
            date: '8-29',
            name: '子级' + i,
            address: '湖南长沙'
          });
        }
        return data;
      }
    },
    methods: {
      filterTag (value, row) {
        return row.name === value;
      }
    }
  }
</script>
<style>
.current-row td{font-weight: bold; background-color: #fefefe;}
</style>
