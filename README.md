# vue-elementui-bigdata-table

> Vue2 elementUI table 组件扩展，大量数据表格。

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run dist
```

## Feature

采用虚拟渲染方案，解决大数据量 DOM 渲染性能瓶颈。  
1、基于 elementUI table，结合 vue-bigdata-table。

参考 [vue-bigdata-table](https://github.com/lison16/vue-bigdata-table)  
参考 elementUI [table 组件](http://element-cn.eleme.io/#/zh-CN/component/table)

## API

### props:

> 参考 elementUI [table 组件](http://element-cn.eleme.io/#/zh-CN/component/table)

> props 添加行高

|   属性    | 说明 |   类型 |   默认值 |
| :-------: | ---- | :----: | :------: |
| rowHeight | 行高 | Number |    32    |

## 使用

> npm i vue-elementui-bigdata-table --save
>
> import ElBigdataTable from 'vue-elementui-bigdata-table.js'
>
> Vue.use(ElBigdataTable)

### 报错(忽略【已修复】)

```shell
[//]: # (error  in ./node_modules/_vue-elementui-bigdata-table@1.2.0@vue-elementui-bigdata-table/src/vue-elementui-bigdata-table/)
[//]: # (table-body.js)
[//]: # (Module parse failed: Unexpected token (36:6))
[//]: # (You may need an appropriate loader to handle this file type.)
[//]: # (|     const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));)
[//]: # (|     return ()
[//]: # (|       <table)
[//]: # (|         class="el-table__body")
[//]: # (|         cellspacing="0")

```

### 解决方法(忽略【已修复】)

````
[//]: # (> 配置 webpack, 添加 vue-elementui-bigdata-table 参与 jsx 解析)
[//]: # (```javascript)
[//]: # (// function resolve (dir) {)
[//]: # (//   return path.join(__dirname, '..', dir))
[//]: # (// })
[//]: # ({)
[//]: # (    test: /\.js$/,)
[//]: # (    loader: 'babel-loader',)
[//]: # (    include: [)
[//]: # (        resolve('src'),)
[//]: # (        resolve('test'),)
[//]: # (        resolve('node_modules/webpack-dev-server/client'),)
[//]: # (        resolve('node_modules/vue-elementui-bigdata-table') //   add)
[//]: # (    ])
[//]: # (})
[//]: # (```)

````

### 问题

由于动态加载数据 props 事件中 \$index 可能不准确。可使用 row 数据查找。
