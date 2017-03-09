'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleExamples = undefined;

var _reactForAtom = require('react-for-atom');

var _Block;

function _load_Block() {
  return _Block = require('./Block');
}

var _Toggle;

function _load_Toggle() {
  return _Toggle = require('./Toggle');
}

const NOOP = () => {}; /**
                        * Copyright (c) 2015-present, Facebook, Inc.
                        * All rights reserved.
                        *
                        * This source code is licensed under the license found in the LICENSE file in
                        * the root directory of this source tree.
                        *
                        * 
                        */

const ToggleExample = () => _reactForAtom.React.createElement(
  'div',
  null,
  _reactForAtom.React.createElement(
    (_Block || _load_Block()).Block,
    null,
    _reactForAtom.React.createElement((_Toggle || _load_Toggle()).Toggle, {
      toggled: false,
      onClick: NOOP,
      onChange: NOOP,
      label: 'A Toggle.'
    })
  ),
  _reactForAtom.React.createElement(
    (_Block || _load_Block()).Block,
    null,
    _reactForAtom.React.createElement((_Toggle || _load_Toggle()).Toggle, {
      onClick: NOOP,
      onChange: NOOP,
      toggled: true,
      label: 'A toggled Toggle.'
    })
  ),
  _reactForAtom.React.createElement(
    (_Block || _load_Block()).Block,
    null,
    _reactForAtom.React.createElement((_Toggle || _load_Toggle()).Toggle, {
      onClick: NOOP,
      onChange: NOOP,
      disabled: true,
      toggled: false,
      label: 'A disabled Toggle.'
    })
  ),
  _reactForAtom.React.createElement(
    (_Block || _load_Block()).Block,
    null,
    _reactForAtom.React.createElement((_Toggle || _load_Toggle()).Toggle, {
      onClick: NOOP,
      onChange: NOOP,
      toggled: true,
      disabled: true,
      label: 'A disabled, toggled Toggle.'
    })
  )
);

const ToggleExamples = exports.ToggleExamples = {
  sectionName: 'Toggle',
  description: 'Toggle input for boolean values',
  examples: [{
    title: 'Toggle Input Example',
    component: ToggleExample
  }]
};