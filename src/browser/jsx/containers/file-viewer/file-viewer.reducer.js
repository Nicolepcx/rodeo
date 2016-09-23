import _ from 'lodash';
import cid from '../../services/cid';
import mapReducers from '../../services/map-reducers';

export function getInitialState() {
  return {
    id: cid(),
    path: '~',
    files: [],
    showDotFiles: false
  };
}

function applyTreeView(files) {
  return _.map(files, file => {
    file.label = file.filename;

    if (file.isDirectory) {
      file.expandable = true;
    }

    return file;
  });
}

function setViewedPath(state, action) {
  console.log('setViewedPath', action);

  state = _.clone(state);
  state.path = action.path;

  if (action.files) {
    state.files = applyTreeView(action.files);
  } else {
    state.files = [];
  }

  return state;
}

function setFileList(state, action) {
  console.log('setFileList', action);

  // Async means multiple file lists could be coming.
  // Only accept the one that matches what we're current viewing.
  if (state.path === action.path) {
    state = _.clone(state);
    state.files = applyTreeView(action.files);
  }

  return state;
}

function selectFile(state, action) {
  const target = action.file;

  if (target && !target.isSelected) {
    state = _.clone(state);
    state.files = _.map(state.files, item => {
      item.isSelected = (item.filename === target.filename);
      return item;
    });
  }

  return state;
}

/**
 * @param {object} state
 * @param {string} propertyName
 * @param {*} value
 * @returns {object}
 */
function changeProperty(state, propertyName, value) {
  state = _.cloneDeep(state);

  _.set(state, propertyName, value);

  return state;
}

function changePreference(state, action) {
  const change = action.change;

  switch (change.key) {
    case 'showDotFiles': return changeProperty(state, 'showDotFiles', change.value);
    case 'workingDirectory': return setViewedPath(state, {path: change.value});
    default: return state;
  }
}

function followIndexPath(items, indexPath) {
  let index = indexPath.shift(),
    cursor = items[index];

  while (indexPath.length) {
    index = indexPath.shift();
    if (cursor.items && cursor.items[index]) {
      index = indexPath.shift();
      cursor = cursor.items[index];
    } else {
      return null;
    }
  }

  return cursor;
}

function folderExpanded(state, action) {
  state = _.cloneDeep(state);

  const indexPath = _.clone(action.indexPath),
    files = state.files;

  if (indexPath.length > 0 && state.path === action.path) {
    const file = followIndexPath(files, indexPath);

    if (file) {
      file.items = action.files;
      file.expanded = true;
    }
  }

  return state;
}

export default mapReducers({
  SET_VIEWED_PATH: setViewedPath,
  LIST_VIEWED_FILES: setFileList,
  SELECT_VIEWED_FILE: selectFile,
  FILE_VIEWER_FOLDER_EXPANDED: folderExpanded,
  PREFERENCE_CHANGE_SAVED: changePreference
}, getInitialState());
