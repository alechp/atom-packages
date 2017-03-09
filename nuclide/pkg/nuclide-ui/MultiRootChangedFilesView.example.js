'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiRootChangedFilesViewExample = undefined;

var _reactForAtom = require('react-for-atom');

var _Block;

function _load_Block() {
  return _Block = require('./Block');
}

var _MultiRootChangedFilesView;

function _load_MultiRootChangedFilesView() {
  return _MultiRootChangedFilesView = require('./MultiRootChangedFilesView');
}

var _vcs;

function _load_vcs() {
  return _vcs = require('../commons-atom/vcs');
}

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function onFileChosen(uri) {
  atom.notifications.addInfo(`Selected file ${uri}`);
}

function BasicExample() {
  const fileChanges = new Map([['nuclide://remote.host/someRemoteDir', new Map([['path/to/some/file/added.js', (_vcs || _load_vcs()).FileChangeStatus.ADDED], ['path/to/some/file/modified.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED], ['path/to/some/file/missing.js', (_vcs || _load_vcs()).FileChangeStatus.MISSING], ['path/to/some/file/removed.js', (_vcs || _load_vcs()).FileChangeStatus.REMOVED], ['path/to/some/file/untracked.js', (_vcs || _load_vcs()).FileChangeStatus.UNTRACKED]])], ['someLocalDir', new Map([['file/with/shared/prefix/foo.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED], ['file/with/shared/prefix/bar.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED], ['file/with/shared/prefix/baz.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED], ['file/with/another/prefix/foo.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED], ['file/with/another/prefix/bar.js', (_vcs || _load_vcs()).FileChangeStatus.MODIFIED]])]]);
  return _reactForAtom.React.createElement(
    'div',
    null,
    _reactForAtom.React.createElement(
      (_Block || _load_Block()).Block,
      null,
      _reactForAtom.React.createElement((_MultiRootChangedFilesView || _load_MultiRootChangedFilesView()).MultiRootChangedFilesView, {
        fileChanges: fileChanges,
        commandPrefix: 'sample-ui-playground',
        selectedFile: null,
        onFileChosen: onFileChosen
      })
    )
  );
}

const MultiRootChangedFilesViewExample = exports.MultiRootChangedFilesViewExample = {
  sectionName: 'MultiRootChangedFilesView',
  description: 'Renders a list of changed files, across one or more directories.',
  examples: [{
    title: 'Basic example',
    component: BasicExample
  }]
};