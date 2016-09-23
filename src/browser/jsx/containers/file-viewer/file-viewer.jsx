import _ from 'lodash';
import {connect} from 'react-redux';
import React from 'react';
import FileTree from '../../components/files/file-tree.jsx';
import fileViewerActions from './file-viewer.actions.js';

function mapStateToProps(state) {
  return state.fileView;
}

function mapDispatchToProps(dispatch) {
  return {
    onRefresh: (filePath) => dispatch(fileViewerActions.getViewedFiles(filePath)),
    onClick: (file) => dispatch(fileViewerActions.selectViewedFile(file)),
    onOpenFile: (file) => dispatch(fileViewerActions.openViewedFile(file)),
    onGoToParentDirectory: (file) => dispatch(fileViewerActions.goToParentDirectory(file)),
    onExpandItem: indexPath => dispatch(fileViewerActions.expandItem(indexPath))
  };
}

function isDotFile(filename) {
  return _.startsWith(_.last(filename.split(/[\/\\]/)), '.');
}

/**
 * @class FileViewer
 * @extends ReactComponent
 * @property props
 */
export default connect(mapStateToProps, mapDispatchToProps)(React.createClass({
  displayName: 'FileViewer',
  propTypes: {
    files: React.PropTypes.array.isRequired,
    filter: React.PropTypes.string.isRequired,
    id: React.PropTypes.string,
    onRefresh: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    path: React.PropTypes.string.isRequired,
    showDotFiles: React.PropTypes.bool
  },
  getDefaultProps: function () {
    return {
      onRefresh: _.noop,
      onSelect: _.noop,
      path: '~',
      filter: '',
      showDotFiles: false
    };
  },
  componentDidMount: function () {
    const props = this.props;

    if (!props.files.length) {
      props.onRefresh();
    }
  },
  shouldComponentUpdate: function (nextProps) {
    const props = this.props;

    return props.path !== nextProps.path || props.filter !== nextProps.filter ||
        props.showDotFiles !== nextProps.showDotFiles ||
        !_.isEqual(props.files, nextProps.files);
  },
  componentDidUpdate: function () {
    const props = this.props;

    if (!props.files.length) {
      props.onRefresh();
    }
  },
  render: function () {
    const props = this.props;
    let files = props.files;

    if (props.filter) {
      files = _.filter(files, item => item.filename.indexOf(props.filter) > -1);
    }

    if (!props.showDotFiles) {
      files = _.filter(files, item => !isDotFile(item.filename));
    }

    return <FileTree files={files} onExpandItem={props.onExpandItem} onGoToParent={props.onGoToParentDirectory} />;
  }
}));
