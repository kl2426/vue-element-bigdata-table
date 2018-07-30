export default {
  name: 'renderDom',
  functional: true,
  props: {
    render: Function,
    backValue: [Number, Object],
    fixed: String,
    store: Object,
    stripe: Boolean,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    highlight: Boolean,
    context: {}
  },
  render: (h, ctx) => {
    return ctx.props.render(h, {
      fixed: ctx.props.fixed,
      store: ctx.props.store,
      stripe: ctx.props.stripe,
      rowClassName: ctx.props.rowClassName,
      rowStyle: ctx.props.rowStyle,
      highlight: ctx.props.highlight,
      context: ctx.props.context,
      style: ctx.data.style
    }, ctx.parent);
  }
};
