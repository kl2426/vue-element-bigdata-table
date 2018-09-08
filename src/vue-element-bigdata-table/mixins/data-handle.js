// import TableStore from '../table-store';
// import TableLayout from '../table-layout';
import ElTableBody from '../table-body.js';
import { getScrollbarWidth } from '../util/index.js';

export default {
  data () {
    // const store = new TableStore(this, {
    //   rowKey: this.rowKey,
    //   defaultExpandAll: this.defaultExpandAll
    // });
    // const layout = new TableLayout({
    //   store,
    //   table: this,
    //   fit: this.fit,
    //   showHeader: this.showHeader
    // });
    //
    return {
      // layout,
      // store,
      scrollLeft: 0,
      scrollTop: 0,
      // 三个tr块中的一块的高度
      moduleHeight: 0,
      /**
       * @description 根据表格容器高度计算内置单个表格（1/3）渲染的行数基础上额外渲染的行数，行数越多表格接替渲染效果越好，但越耗性能
       */
      appendNum: 15,
      // 一块数据显示的数据条数
      itemNum: 0,
      /**
       * @description 表头高度
       */
      headerHeight: 0,
      /**
      * @description 表格行高
      */
      itemRowHeight: 48,
      //  表格滚动区域高度
      wrapperHeight: 0,
      // 当前展示的表格是第几个
      totalRowHeight: 0, // 如果全量渲染应该是多高，用于计算占位
      currentIndex: 0,
      times0: 0, // 当前是第几轮
      times1: 0,
      times2: -1,
      topPlaceholderHeight: 0, // 顶部占位容器高度
      table1Data: [],
      table2Data: [],
      table3Data: [],
      outerWidth: 0 // 外面容器宽度
    };
  },
  methods: {
    //  滚动条拖动
    handleScroll (e) {
      const ele = e.srcElement || e.target;
      const { scrollTop, scrollLeft } = ele;
      this.scrollLeft = scrollLeft;
      this.scrollTop = scrollTop;
    },
    //  获取高度与数量
    updateHeight () {
      this.$nextTick(() => {
        let wrapperHeight = this.$refs.bodyWrapper.offsetHeight;
        this.itemNum = Math.ceil((wrapperHeight - this.headerHeight) / this.itemRowHeight) + this.appendNum;
        this.moduleHeight = this.itemNum * this.itemRowHeight;
        this.wrapperHeight = wrapperHeight;
        this.setTopPlace();
      });
    },
    //  设置顶部定位
    setTopPlace () {
      let scrollTop = this.scrollTop;
      let t0 = 0;
      let t1 = 0;
      let t2 = 0;
      if (scrollTop > this.moduleHeight) {
        switch (this.currentIndex) {
          case 0: t0 = parseInt(scrollTop / (this.moduleHeight * 3)); t1 = t2 = t0; break;
          case 1: t1 = parseInt((scrollTop - this.moduleHeight) / (this.moduleHeight * 3)); t0 = t1 + 1; t2 = t1; break;
          case 2: t2 = parseInt((scrollTop - this.moduleHeight * 2) / (this.moduleHeight * 3)); t0 = t1 = t2 + 1;
        }
      }
      this.times0 = t0;
      this.times1 = t1;
      this.times2 = t2;
      this.topPlaceholderHeight = parseInt(scrollTop / this.moduleHeight) * this.moduleHeight;
      // this.setTableData();
    },
    //  设置数据
    setTableData () {
      const count1 = this.times0 * this.itemNum * 3;
      this.table1Data = this.insideTableData.slice(count1, count1 + this.itemNum);
      const count2 = this.times1 * this.itemNum * 3;
      this.table2Data = this.insideTableData.slice(count2 + this.itemNum, count2 + this.itemNum * 2);
      const count3 = this.times2 * this.itemNum * 3;
      this.table3Data = this.insideTableData.slice(count3 + this.itemNum * 2, count3 + this.itemNum * 3);

      // console.log('==========this.table1Data', this.table1Data);
      // console.log('==========this.table2Data', this.table2Data);
      // console.log('==========this.table3Data', this.table3Data);
    },
    // 给表格数据添加行号，用于排序后正确修改数据
    setIndex (tableData) {
      return tableData.map((item, i) => {
        let row = item;
        row.initRowIndex = i;
        return row;
      });
    },
    setComputedProps () {
      const len = this.store.states.filteredData.length;
      this.totalRowHeight = len * this.itemRowHeight;
    },

    // _initM () {
    //   if (this.indexWidth === undefined) this.indexWidthInside = this.setIndexWidth(this.insideTableData.length);
    //   else this.indexWidthInside = this.indexWidth;
    //   this.oldTableWidth = this.colWidthArr.reduce((sum, b) => {
    //     return sum + b;
    //   }, 0);
    //   this.widthArr = this.colWidthArr;
    //   if ((this.colWidth * this.columns.length + (this.showIndex ? this.indexWidthInside : 0)) < this.outerWidth) this._setColWidthArr();
    // },
    //

    _tableResize () {
      this.$nextTick(() => {
        this.updateHeight();
        this.setComputedProps();
        let scrollBarWidth = this.totalRowHeight > this.wrapperHeight ? getScrollbarWidth() : 0;
        this.outerWidth = this.$refs.bodyWrapper.offsetWidth - 2 - scrollBarWidth;
        // let width = this.colWidth * this.columns.length + (this.showIndex ? this.indexWidthInside : 0);
        // this.tableWidth = width > this.outerWidth ? width : this.outerWidth;
        // this.tableWidth = this.fixedWrapperWidth ? this.outerWidth : (width > this.outerWidth ? width : this.outerWidth);
        // if (width < this.outerWidth) this._setColWidthArr();
        // this.widthArr = this.colWidthArr;
      });
    },
    //  生成三个Vnode的数组
    getTables (h, prop) {
      let table1 = this.getItemTable(h, this.table1Data, 1, prop);
      let table2 = this.getItemTable(h, this.table2Data, 2, prop);
      let table3 = this.getItemTable(h, this.table3Data, 3, prop);
      if (this.currentIndex === 0) return [table1, table2, table3];
      else if (this.currentIndex === 1) return [table2, table3, table1];
      else return [table3, table1, table2];
    },
    //  三个Vnode的外包装
    renderTable (h, prop) {
      return h('div', {
        style: prop.style
      }, this.getTables(h, prop));
    },
    //  生成body
    getItemTable (h, data, index, prop) {
      return h(ElTableBody, {
        style: {width: '100%'},
        props: {
          store: this.store,
          tableData: data,
          stripe: prop.stripe,
          context: prop.context,
          rowClassName: prop.rowClassName,
          rowStyle: prop.rowStyle,
          fixed: prop.fixed,
          highlight: prop.highlight,
          times: index === 1 ? this.times0 : (index === 2 ? this.times1 : this.times2),
          itemNum: this.itemNum,
          tableIndex: index
        },
        on: {
          //
        },
        key: 'table-item-key' + index,
        ref: 'itemTable' + index,
        attrs: {
          'data-index': index
        }
      });
    },

    //
    // 涉及到表格容器尺寸变化或数据变化的情况调用此方法重新计算相关值
    resize () {
      this._tableResize();
    },
    // 获取表格横向滚动的距离
    getScrollLeft () {
      return this.$refs.outer.scrollLeft;
    },
    // 调用此方法跳转到某条数据
    scrollToRow (index) {
      this._scrollToIndexRow(index);
    },
    // canEdit为true时调用此方法使第row+1行第col+1列变为编辑状态，这里的行列指的是表格显示的行和除序列号列的列
    editCell (row, col) {
      this._editCell(row, col);
    }
  },
  computed: {
    bottomPlaceholderHeight () {
      return (this.placeholderHeight - this.topPlaceholderHeight) < 0 ? 0 : this.placeholderHeight - this.topPlaceholderHeight;
    },
    placeholderHeight () {
      return this.totalRowHeight - this.moduleHeight * 3; // 占位容器的总高度(上 + 下)
    }
  },
  watch: {
    scrollTop (top) {
      this.currentIndex = parseInt((top % (this.moduleHeight * 3)) / this.moduleHeight);
      this.$nextTick(() => {
        this.setTopPlace();
      });
    },
    data: {
      immediate: true,
      handler (value) {
        // console.log('==============watch data')
        this.insideTableData = this.setIndex(value);
        this.resize();
        // console.log('==============watch data')
        // this.store.commit('setData', value);
        if (this.$ready) {
          this.$nextTick(() => {
            // this.doLayout();
            //  设置滚动条高度与左边度
            this.scrollLeft = 0;
            this.scrollTop = 0;
            //  更新
            this.setComputedProps();
            //  延迟 计算滚动条是否显示
            setTimeout(() => {
              this.updateScrollY();
            }, 100);
          });
        }
      }
    },
    insideTableData () {
      this.resize();
    }// ,
  },
  mounted () {
    this.$nextTick(() => {
      this.insideTableData = this.setIndex(this.tableData);
      // console.log('==========this.insideTableData==', this.insideTableData);
      // this._initM();
      this.resize();
    });
  }
};
