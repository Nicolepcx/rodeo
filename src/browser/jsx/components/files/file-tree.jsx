import _ from 'lodash';
import React from 'react';
import commonReact from '../../services/common-react';
import TreeView from '../tree-view/tree-view';
import FileListItem from './file-list-item.jsx';
import './file-tree.css';

/**
 * @class FileList
 * @description Visual representation of the chrome around a list of files. Can show parent, sorts files by directory/file.
 * @extends ReactComponent
 * @property props
 */
export default React.createClass({
  displayName: 'FileTree',
  propTypes: {
    files: React.PropTypes.array,
    id: React.PropTypes.string,
    onExpandItem: React.PropTypes.func,
    onGoToParent: React.PropTypes.func
  },
  handleCaretClick: function (indexPath, props, event) {
    console.log('handleCaretClick', indexPath, props);

    event.preventDefault();

    this.props.onExpandItem(indexPath, props);
  },
  render: function () {
    const props = this.props,
      className = commonReact.getClassNameList(this);
    let parent;

    if (props.onGoToParent) {
      parent = <FileListItem basePath={props.path} filename=".." key=".." onDoubleClick={props.onGoToParent} />;
    }

    return (
      <div className={className}>
        {parent}
        <TreeView items={props.files} onCaretClick={this.handleCaretClick}/>
      </div>
    );
  }
});
