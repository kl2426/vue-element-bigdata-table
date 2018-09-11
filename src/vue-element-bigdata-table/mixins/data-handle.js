// import TableStore from '../table-store';
// import TableLayout from '../table-layout';
import ElTableBody from '../table-body.js';
import { getScrollbarWidth } from '../util/index.js';

export default {
  data () {
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
      //  rowHeight: 32,
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
      outerWidth: 0, // 外面容器宽度
      groupHeight: {},
      groupIndex: 0
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
      this.itemNum = Math.ceil(this.height / this.rowHeight) + this.appendNum;
      this.wrapperHeight = this.$refs.bodyWrapper.offsetHeight;
      this.setTopPlace();
    },
    //
    initGroupHeight (data) {
      //  分组数据
      let moduleNb = Math.ceil(this.height / this.rowHeight) + this.appendNum;
      console.log('moduleNb', moduleNb)
      let groupHeight = {};
      if (data.length > moduleNb) {
        for (let i in data) {
          let nb = (+i + 1) * moduleNb;
          if (nb > data.length) {
            groupHeight[i] = (data.length % moduleNb) * this.rowHeight;
            break;
          }
          groupHeight[i] = moduleNb * this.rowHeight;
        }
      } else {
        groupHeight[0] = data.length * this.rowHeight;
      }
      return groupHeight;
    },
    //  设置顶部定位
    setTopPlace () {
      let scrollTop = this.scrollTop;
      let t0 = 0;
      let t1 = 0;
      let t2 = 0;
      if (scrollTop > this.groupHeight[0]) {
        switch (this.currentIndex) {
          case 0: t0 = parseInt(this.groupIndex / 3); t1 = t2 = t0; break;
          case 1: t1 = parseInt(this.groupIndex / 3); t0 = t1 + 1; t2 = t1; break;
          case 2: t2 = parseInt(this.groupIndex / 3); t0 = t1 = t2 + 1;
        }
      }
      this.times0 = t0;
      this.times1 = t1;
      this.times2 = t2;
      //
      let height = 0;
      for (let i in this.groupHeight) {
        if (+i === +this.groupIndex) {
          break;
        }
        height += this.groupHeight[i];
      }
      this.topPlaceholderHeight = height;
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
      let height = 0;
      for (let i in this.groupHeight) {
        height += this.groupHeight[i];
      }
      this.totalRowHeight = height;
    },
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
        class: 'vue-element-bigdata-table-div',
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
          times0: this.times0,
          times1: this.times1,
          times2: this.times2,
          itemNum: this.itemNum,
          tableIndex: index,
          groupIndex: +this.groupIndex,
          itemRowHeight: this.rowHeight
        },
        on: {
          //
          'changeHeight': (index, height) => {
            this.groupHeight[index] = height;
            //
            this.setComputedProps();
          }
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
      //  当前三块总高度
      let mdHeight = 0;
      let arr = [];
      for (let i in this.groupHeight) {
        arr[i] = this.groupHeight[i];
      }
      arr = arr.slice(this.groupIndex, +this.groupIndex + 3);
      for (let n of arr) {
        mdHeight += n;
      }
      return this.totalRowHeight - mdHeight; // 占位容器的总高度(上 + 下)
    }
  },
  watch: {
    scrollTop (top) {
      //  当前滚动条是在三个table中的哪一个
      let height = 0;
      //  通过当前上部站位得到三个table最上一个table的是哪个组
      // let index = 0;
      for (let i in this.groupHeight) {
        if (top >= height && top < (height + (this.groupHeight[i] ? this.groupHeight[i] : 0))) {
          this.groupIndex = +i;
          break;
        }
        height += this.groupHeight[i];
      }
      //
      this.currentIndex = this.groupIndex % 3;
      this.$nextTick(() => {
        this.setTopPlace();
      });
    },
    data: {
      immediate: true,
      handler (value) {
        this.insideTableData = this.setIndex(value);
        this.groupHeight = this.initGroupHeight(value);
        this.resize();
        // this.store.commit('setData', value);
        if (this.$ready) {
          this.$nextTick(() => {
            // this.doLayout();
            //  设置滚动条高度与左边度
            // this.scrollLeft = 0;
            // this.scrollTop = 0;
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
    },
    tableData (newValue) {
      //  重置高度分组
      this.groupHeight = this.initGroupHeight(newValue);
      this.resize();
    }

  },
  mounted () {
    this.$nextTick(() => {
      this.insideTableData = this.setIndex(this.tableData);
      // this._initM();
      this.resize();
    });
  }
};
