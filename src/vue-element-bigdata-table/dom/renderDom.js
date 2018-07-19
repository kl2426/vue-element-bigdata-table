export default {
  name: 'renderDom',
  functional: true,
  props: {
    render: Function,
    backValue: [Number, Object],
    fixed: String
  },
  render: (h, ctx) => {
    return ctx.props.render(h, {
      fixed: ctx.props.fixed,
      style: ctx.data.style
    }, ctx.parent);
  }
};
