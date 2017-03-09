'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AtomTextEditor;

function _load_AtomTextEditor() {
  return _AtomTextEditor = require('../../../nuclide-ui/AtomTextEditor');
}

var _reactForAtom = require('react-for-atom');

class Console extends _reactForAtom.React.Component {
  render() {
    return _reactForAtom.React.createElement((_AtomTextEditor || _load_AtomTextEditor()).AtomTextEditor, {
      gutterHidden: true,
      path: '.ansi',
      readOnly: true,
      textBuffer: this.props.textBuffer
    });
  }
}
exports.default = Console; /**
                            * Copyright (c) 2015-present, Facebook, Inc.
                            * All rights reserved.
                            *
                            * This source code is licensed under the license found in the LICENSE file in
                            * the root directory of this source tree.
                            *
                            * 
                            */