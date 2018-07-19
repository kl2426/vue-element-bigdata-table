import ElBigdataTable from './table.vue';
const install = (Vue, opts = {}) => {
  Vue.component('ElBigdataTable', ElBigdataTable);
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default Object.assign(ElBigdataTable, {install});
