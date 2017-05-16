'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutlineView = undefined;

var _react = _interopRequireDefault(require('react'));

var _classnames;

function _load_classnames() {
  return _classnames = _interopRequireDefault(require('classnames'));
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _goToLocation;

function _load_goToLocation() {
  return _goToLocation = require('../../commons-atom/go-to-location');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _LoadingSpinner;

function _load_LoadingSpinner() {
  return _LoadingSpinner = require('../../nuclide-ui/LoadingSpinner');
}

var _PanelComponentScroller;

function _load_PanelComponentScroller() {
  return _PanelComponentScroller = require('../../nuclide-ui/PanelComponentScroller');
}

var _Message;

function _load_Message() {
  return _Message = require('../../nuclide-ui/Message');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)(); /**
                                                                              * Copyright (c) 2015-present, Facebook, Inc.
                                                                              * All rights reserved.
                                                                              *
                                                                              * This source code is licensed under the license found in the LICENSE file in
                                                                              * the root directory of this source tree.
                                                                              *
                                                                              * 
                                                                              * @format
                                                                              */

const TOKEN_KIND_TO_CLASS_NAME_MAP = {
  keyword: 'syntax--keyword',
  'class-name': 'syntax--entity syntax--name syntax--class',
  constructor: 'syntax--entity syntax--name syntax--function',
  method: 'syntax--entity syntax--name syntax--function',
  param: 'syntax--variable',
  string: 'syntax--string',
  whitespace: '',
  plain: '',
  type: 'syntax--support syntax--type'
};

class OutlineView extends _react.default.Component {

  constructor(props) {
    super(props);
    this.state = {
      outline: {
        kind: 'empty'
      }
    };
  }

  componentDidMount() {
    if (!(this.subscription == null)) {
      throw new Error('Invariant violation: "this.subscription == null"');
    }

    this.subscription = this.props.outlines.subscribe(outline => {
      this.setState({ outline });
    });
  }

  componentWillUnmount() {
    if (!(this.subscription != null)) {
      throw new Error('Invariant violation: "this.subscription != null"');
    }

    this.subscription.unsubscribe();
    this.subscription = null;
  }

  render() {
    return _react.default.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', width: '100%' } },
      _react.default.createElement(
        (_PanelComponentScroller || _load_PanelComponentScroller()).PanelComponentScroller,
        null,
        _react.default.createElement(
          'div',
          { className: 'nuclide-outline-view' },
          _react.default.createElement(OutlineViewComponent, { outline: this.state.outline })
        )
      )
    );
  }
}

exports.OutlineView = OutlineView;


class OutlineViewComponent extends _react.default.Component {

  render() {
    const outline = this.props.outline;
    const noOutlineAvailableMessage = _react.default.createElement(
      (_Message || _load_Message()).Message,
      null,
      'No outline available.'
    );
    switch (outline.kind) {
      case 'empty':
      case 'not-text-editor':
        return noOutlineAvailableMessage;
      case 'loading':
        return _react.default.createElement(
          'div',
          { className: 'nuclide-outline-view-loading' },
          _react.default.createElement((_LoadingSpinner || _load_LoadingSpinner()).LoadingSpinner, {
            className: 'inline-block',
            size: (_LoadingSpinner || _load_LoadingSpinner()).LoadingSpinnerSizes.MEDIUM
          })
        );
      case 'no-provider':
        return outline.grammar === 'Null Grammar' ? noOutlineAvailableMessage : _react.default.createElement(
          (_Message || _load_Message()).Message,
          { type: (_Message || _load_Message()).MessageTypes.warning },
          'Outline view does not currently support ',
          outline.grammar,
          '.'
        );
      case 'provider-no-outline':
        return noOutlineAvailableMessage;
      case 'outline':
        return renderTrees(outline.editor, outline.outlineTrees);
      default:
        const errorText = `Encountered unexpected outline kind ${outline.kind}`;
        logger.error(errorText);
        return _react.default.createElement(
          (_Message || _load_Message()).Message,
          { type: (_Message || _load_Message()).MessageTypes.error },
          'Internal Error:',
          _react.default.createElement('br', null),
          errorText
        );
    }
  }
}

class OutlineTree extends _react.default.PureComponent {

  render() {
    const { editor, outline } = this.props;

    const onClick = () => {
      const pane = atom.workspace.paneForItem(editor);
      if (pane == null) {
        return;
      }
      (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('nuclide-outline-view:go-to-location');
      pane.activate();
      pane.activateItem(editor);
      (0, (_goToLocation || _load_goToLocation()).goToLocationInEditor)(editor, outline.startPosition.row, outline.startPosition.column);
    };

    const onDoubleClick = () => {
      // Assumes that the click handler has already run, activating the text editor and moving the
      // cursor to the start of the symbol.
      const endPosition = outline.endPosition;
      if (endPosition != null) {
        editor.selectToBufferPosition(endPosition);
      }
    };

    const classes = (0, (_classnames || _load_classnames()).default)('list-nested-item', {
      selected: outline.highlighted
    });
    return _react.default.createElement(
      'li',
      { className: classes },
      _react.default.createElement(
        'div',
        {
          className: 'list-item nuclide-outline-view-item',
          onClick: onClick,
          onDoubleClick: onDoubleClick },
        renderItem(outline)
      ),
      renderTrees(editor, outline.children)
    );
  }
}

function renderItem(outline) {
  const r = [];

  if (outline.icon != null) {
    r.push(_react.default.createElement('span', { className: `icon icon-${outline.icon}` }));
    // Note: icons here are fixed-width, so the text lines up.
  }

  if (outline.tokenizedText != null) {
    r.push(...outline.tokenizedText.map(renderTextToken));
  } else if (outline.plainText != null) {
    r.push(outline.plainText);
  } else {
    r.push('Missing text');
  }

  return r;
}

function renderTextToken(token, index) {
  const className = TOKEN_KIND_TO_CLASS_NAME_MAP[token.kind];
  return _react.default.createElement(
    'span',
    { className: className, key: index },
    token.value
  );
}

function renderTrees(editor, outlines) {
  if (outlines.length === 0) {
    return null;
  }
  return (
    // Add `position: relative;` to let `li.selected` style position itself relative to the list
    // tree rather than to its container.
    _react.default.createElement(
      'ul',
      { className: 'list-tree', style: { position: 'relative' } },
      outlines.map((outline, index) => _react.default.createElement(OutlineTree, { editor: editor, outline: outline, key: index }))
    )
  );
}