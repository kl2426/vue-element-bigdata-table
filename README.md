# vue-element-bigdata-table

> Vue2 elementUI table 组件扩展，大量数据表格。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run dist
```
## Feature

采用虚拟渲染方案，解决大数据量DOM渲染性能瓶颈。  
1、基于elementUI table，结合vue-bigdata-table。  


参考 [vue-bigdata-table](https://github.com/lison16/vue-bigdata-table)  
参考elementUI [table组件](http://element-cn.eleme.io/#/zh-CN/component/table)

## API

### props:

>参考elementUI [table组件](http://element-cn.eleme.io/#/zh-CN/component/table)

>props 添加行高

属性  |  说明  |  类型  |  默认值
:-------: | -------  |  :-------:  |  :-------:
rowHeight  |  行高  | Number  | 32


## 使用
> npm 引用时，由于插件使用了jsx es6 需要配置webpack babel-loader

### 报错
``` shell
error  in ./node_modules/_vue-element-bigdata-table@1.2.0@vue-element-bigdata-table/src/vue-element-bigdata-table/table-body.js

Module parse failed: Unexpected token (36:6)
You may need an appropriate loader to handle this file type.
|     const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
|     return (
|       <table
|         class="el-table__body"
|         cellspacing="0"

```
### 解决方法
> 配置webpack, 添加vue-element-bigdata-table参与jsx解析
``` javascript
// function resolve (dir) {
//   return path.join(__dirname, '..', dir)
// }

{
    test: /\.js$/,
    loader: 'babel-loader',
    include: [
        resolve('src'), 
        resolve('test'), 
        resolve('node_modules/webpack-dev-server/client'), 
        resolve('node_modules/vue-element-bigdata-table') //   add
    ]
}
```
### 问题
由于动态加载数据 props事件中 $index可能不准确。可使用row数据查找。