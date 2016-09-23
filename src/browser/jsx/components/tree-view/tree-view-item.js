import _ from 'lodash';
import React from 'react';
import commonReact from '../../services/common-react';

function wrapWithPath(index) {
  return function (fn, path) {
    const args = _.slice(arguments, 2);

    return fn.apply(undefined, [path.concat([index])].concat(args));
  };
}

const TreeViewItem = React.createClass({
  displayName: 'TreeViewItem',
  propTypes: {
    expanded: React.PropTypes.bool.isRequired,
    items: React.PropTypes.array,
    label: React.PropTypes.string.isRequired,
    onCaretClick: React.PropTypes.func.isRequired,
    showCaret: React.PropTypes.bool.isRequired
  },
  getDefaultProps: function () {
    return {
      expanded: false,
      showCaret: true
    };
  },
  shouldComponentUpdate: function (nextProps) {
    return commonReact.shouldComponentUpdate(this, nextProps);
  },
  render: function () {
    const props = this.props,
      className = commonReact.getClassNameList(this);

    let label, items, caret;

    if (props.label) {
      label = <span>{props.label}</span>;
    }

    if (props.items && props.expanded) {
      className.push('expanded');
      items = (
        <div className="tree-view-item-children">
          {props.items.map((item, index) => {
            const onCaretClickWithPath = _.wrap(props.onCaretClick, wrapWithPath(index));

            return <TreeViewItem onCaretClick={onCaretClickWithPath} {...item}/>;
          })}
        </div>
      );
    }

    if ((props.items && props.showCaret) || (props.expandable && props.showCaret)) {
      caret = <span className="fa fa-caret-right tree-view-caret" onClick={_.partial(props.onCaretClick, [], props)}/>;
    }

    return (
      <div className={className.join(' ')}>
        {caret}
        {label}
        {items}
      </div>
    );
  }
});

export default TreeViewItem;
