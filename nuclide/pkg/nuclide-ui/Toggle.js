'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toggle = undefined;

var _reactForAtom = require('react-for-atom');

var _classnames;

function _load_classnames() {
  return _classnames = _interopRequireDefault(require('classnames'));
}

var _ignoreTextSelectionEvents;

function _load_ignoreTextSelectionEvents() {
  return _ignoreTextSelectionEvents = _interopRequireDefault(require('./ignoreTextSelectionEvents'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A toggle component with an input toggle and a label. We restrict the label to a string
 * to ensure this component is pure.
 */
class Toggle extends _reactForAtom.React.Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    const isToggled = event.target.checked;
    this.props.onChange.call(null, isToggled);
  }

  render() {
    const {
      className,
      disabled,
      label,
      onClick,
      toggled
    } = this.props;
    const text = label === '' ? null : _reactForAtom.React.createElement(
      'span',
      { className: 'nuclide-ui-toggle-label-text' },
      ' ',
      label
    );
    return _reactForAtom.React.createElement(
      'label',
      {
        className: (0, (_classnames || _load_classnames()).default)(className, 'nuclide-ui-toggle-label', {
          'nuclide-ui-toggle-disabled': disabled
        }),
        onClick: onClick && (0, (_ignoreTextSelectionEvents || _load_ignoreTextSelectionEvents()).default)(onClick) },
      _reactForAtom.React.createElement('input', {
        checked: toggled,
        className: 'input-toggle',
        disabled: disabled,
        onChange: this._onChange,
        type: 'checkbox'
      }),
      text
    );
  }
}
exports.Toggle = Toggle; /**
                          * Copyright (c) 2015-present, Facebook, Inc.
                          * All rights reserved.
                          *
                          * This source code is licensed under the license found in the LICENSE file in
                          * the root directory of this source tree.
                          *
                          * 
                          */

Toggle.defaultProps = {
  disabled: false,
  onClick(event) {}
};