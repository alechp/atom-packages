'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactForAtom = require('react-for-atom');

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _Constants;

function _load_Constants() {
  return _Constants = require('../lib/Constants');
}

var _vcs;

function _load_vcs() {
  return _vcs = require('../../commons-atom/vcs');
}

var _FileTree;

function _load_FileTree() {
  return _FileTree = require('./FileTree');
}

var _FileTreeSideBarFilterComponent;

function _load_FileTreeSideBarFilterComponent() {
  return _FileTreeSideBarFilterComponent = _interopRequireDefault(require('./FileTreeSideBarFilterComponent'));
}

var _FileTreeToolbarComponent;

function _load_FileTreeToolbarComponent() {
  return _FileTreeToolbarComponent = require('./FileTreeToolbarComponent');
}

var _OpenFilesListComponent;

function _load_OpenFilesListComponent() {
  return _OpenFilesListComponent = require('./OpenFilesListComponent');
}

var _FileTreeActions;

function _load_FileTreeActions() {
  return _FileTreeActions = _interopRequireDefault(require('../lib/FileTreeActions'));
}

var _FileTreeStore;

function _load_FileTreeStore() {
  return _FileTreeStore = require('../lib/FileTreeStore');
}

var _MultiRootChangedFilesView;

function _load_MultiRootChangedFilesView() {
  return _MultiRootChangedFilesView = require('../../nuclide-ui/MultiRootChangedFilesView');
}

var _PanelComponentScroller;

function _load_PanelComponentScroller() {
  return _PanelComponentScroller = require('../../nuclide-ui/PanelComponentScroller');
}

var _observable;

function _load_observable() {
  return _observable = require('../../commons-node/observable');
}

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('../../commons-node/UniversalDisposable'));
}

var _event;

function _load_event() {
  return _event = require('../../commons-node/event');
}

var _Section;

function _load_Section() {
  return _Section = require('../../nuclide-ui/Section');
}

var _featureConfig;

function _load_featureConfig() {
  return _featureConfig = _interopRequireDefault(require('../../commons-atom/featureConfig'));
}

var _goToLocation;

function _load_goToLocation() {
  return _goToLocation = require('../../commons-atom/go-to-location');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SHOW_OPEN_FILE_CONFIG_KEY = 'nuclide-file-tree.showOpenFiles'; /**
                                                                      * Copyright (c) 2015-present, Facebook, Inc.
                                                                      * All rights reserved.
                                                                      *
                                                                      * This source code is licensed under the license found in the LICENSE file in
                                                                      * the root directory of this source tree.
                                                                      *
                                                                      * 
                                                                      */

const SHOW_UNCOMMITTED_CHANGES_CONFIG_KEY = 'nuclide-file-tree.showUncommittedChanges';

class FileTreeSidebarComponent extends _reactForAtom.React.Component {

  constructor() {
    super();

    this._actions = (_FileTreeActions || _load_FileTreeActions()).default.getInstance();
    this._store = (_FileTreeStore || _load_FileTreeStore()).FileTreeStore.getInstance();
    this.state = {
      hidden: false,
      shouldRenderToolbar: false,
      scrollerHeight: window.innerHeight,
      scrollerScrollTop: 0,
      showOpenFiles: true,
      showUncommittedChanges: true,
      openFilesUris: [],
      modifiedUris: [],
      activeUri: null,
      hasUncommittedChanges: false,
      uncommittedFileChanges: new Map()
    };
    this._showOpenConfigValues = (0, (_observable || _load_observable()).cacheWhileSubscribed)((_featureConfig || _load_featureConfig()).default.observeAsStream(SHOW_OPEN_FILE_CONFIG_KEY));
    this._showUncommittedConfigValue = (0, (_observable || _load_observable()).cacheWhileSubscribed)((_featureConfig || _load_featureConfig()).default.observeAsStream(SHOW_UNCOMMITTED_CHANGES_CONFIG_KEY));

    this._disposables = new (_UniversalDisposable || _load_UniversalDisposable()).default();
    this._scrollWasTriggeredProgrammatically = false;
    this._handleFocus = this._handleFocus.bind(this);
    this._updateScrollerHeight = this._updateScrollerHeight.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._scrollToPosition = this._scrollToPosition.bind(this);
    this._processExternalUpdate = this._processExternalUpdate.bind(this);
    this._handleOpenFilesExpandedChange = this._handleOpenFilesExpandedChange.bind(this);
    this._handleUncommittedFilesExpandedChange = this._handleUncommittedFilesExpandedChange.bind(this);
  }

  componentDidMount() {
    this._processExternalUpdate();

    const remeasureEvents = _rxjsBundlesRxMinJs.Observable.merge(_rxjsBundlesRxMinJs.Observable.of(null), _rxjsBundlesRxMinJs.Observable.fromEvent(window, 'resize'), (0, (_event || _load_event()).observableFromSubscribeFunction)(atom.commands.onDidDispatch.bind(atom.commands)).filter(event => event.type === 'nuclide-file-tree:toggle'), _rxjsBundlesRxMinJs.Observable.interval(2000));

    this._disposables.add(this._store.subscribe(this._processExternalUpdate), atom.project.onDidChangePaths(this._processExternalUpdate), (0, (_observable || _load_observable()).toggle)(observeAllModifiedStatusChanges(), this._showOpenConfigValues).subscribe(() => this._setModifiedUris()), this._monitorActiveUri(), this._showOpenConfigValues.subscribe(showOpenFiles => this.setState({ showOpenFiles })), this._showUncommittedConfigValue.subscribe(showUncommittedChanges => this.setState({ showUncommittedChanges })), (0, (_observable || _load_observable()).throttle)(remeasureEvents, () => (_observable || _load_observable()).nextAnimationFrame).subscribe(() => {
      this._updateScrollerHeight();
    }),

    // Customize the context menu to remove items that match the 'atom-pane' selector.
    _rxjsBundlesRxMinJs.Observable.fromEvent(_reactForAtom.ReactDOM.findDOMNode(this), 'contextmenu').switchMap(event => {
      if (event.button !== 2) {
        return _rxjsBundlesRxMinJs.Observable.never();
      }

      event.preventDefault();
      event.stopPropagation();

      // Find all the item sets that match the 'atom-pane' selector. We're going to remove these
      // by changing their selector.
      const paneItemSets = atom.contextMenu.itemSets.filter(itemSet => itemSet.selector === 'atom-pane');
      // Override the selector while we get the template.
      paneItemSets.forEach(itemSet => {
        itemSet.selector = 'do-not-match-anything';
      });
      const menuTemplate = atom.contextMenu.templateForEvent(event);
      paneItemSets.forEach(itemSet => {
        itemSet.selector = 'atom-pane';
      });
      // Wrap the disposable in an observable. This way we don't have to manually track these
      // disposables, they'll be managed for us.
      return _rxjsBundlesRxMinJs.Observable.create(() => showMenuForEvent(event, menuTemplate));
    }).subscribe());
  }

  componentWillUnmount() {
    this._disposables.dispose();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hidden !== prevState.hidden) {
      if (!this.state.hidden) {
        // If "Reveal File on Switch" is enabled, ensure the scroll position is synced to where the
        // user expects when the side bar shows the file tree.
        if ((_featureConfig || _load_featureConfig()).default.get((_Constants || _load_Constants()).REVEAL_FILE_ON_SWITCH_SETTING)) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:reveal-active-file');
        }
        this._actions.clearFilter();
        this._updateScrollerHeight();
      }
    }
  }

  _handleFocus(event) {
    // Delegate focus to the FileTree component if this component gains focus because the FileTree
    // matches the selectors targeted by themes to show the containing panel has focus.
    if (event.target === _reactForAtom.ReactDOM.findDOMNode(this)) {
      // $FlowFixMe
      _reactForAtom.ReactDOM.findDOMNode(this.refs.fileTree).focus();
    }
  }

  render() {
    const workingSetsStore = this._store.getWorkingSetsStore();
    let toolbar;
    if (this.state.shouldRenderToolbar && workingSetsStore != null) {
      toolbar = _reactForAtom.React.createElement(
        'div',
        { className: 'nuclide-file-tree-fixed' },
        _reactForAtom.React.createElement((_FileTreeSideBarFilterComponent || _load_FileTreeSideBarFilterComponent()).default, {
          key: 'filter',
          filter: this._store.getFilter(),
          found: this._store.getFilterFound()
        }),
        _reactForAtom.React.createElement((_FileTreeToolbarComponent || _load_FileTreeToolbarComponent()).FileTreeToolbarComponent, {
          key: 'toolbar',
          workingSetsStore: workingSetsStore
        })
      );
    }

    let uncommittedChangesSection;
    if (this.state.showUncommittedChanges && this.state.hasUncommittedChanges) {
      const uncommittedChangesList = _reactForAtom.React.createElement(
        'div',
        { className: 'nuclide-file-tree-sidebar-uncommitted-changes' },
        _reactForAtom.React.createElement((_MultiRootChangedFilesView || _load_MultiRootChangedFilesView()).MultiRootChangedFilesView, {
          commandPrefix: 'file-tree-sidebar',
          fileChanges: (0, (_vcs || _load_vcs()).filterMultiRootFileChanges)(this.state.uncommittedFileChanges),
          selectedFile: this.state.activeUri,
          hideEmptyFolders: true,
          onFileChosen: this._onFileChosen
        })
      );

      uncommittedChangesSection = _reactForAtom.React.createElement(
        (_Section || _load_Section()).Section,
        {
          className: 'nuclide-file-tree-section-caption',
          collapsable: true,
          collapsed: !this._store.uncommittedChangesExpanded,
          headline: 'UNCOMMITTED CHANGES',
          onChange: this._handleUncommittedFilesExpandedChange,
          size: 'small' },
        uncommittedChangesList
      );
    }

    let openFilesSection = null;
    let openFilesList = null;
    if (this.state.showOpenFiles && this.state.openFilesUris.length > 0) {
      if (this._store.openFilesExpanded) {
        openFilesList = _reactForAtom.React.createElement((_OpenFilesListComponent || _load_OpenFilesListComponent()).OpenFilesListComponent, {
          uris: this.state.openFilesUris,
          modifiedUris: this.state.modifiedUris,
          activeUri: this.state.activeUri
        });
      }
      openFilesSection = _reactForAtom.React.createElement(
        (_Section || _load_Section()).Section,
        {
          className: 'nuclide-file-tree-section-caption',
          collapsable: true,
          collapsed: !this._store.openFilesExpanded,
          headline: 'OPEN FILES',
          onChange: this._handleOpenFilesExpandedChange,
          size: 'small' },
        openFilesList
      );
    }

    let foldersCaption;
    if (uncommittedChangesSection != null || openFilesSection != null) {
      foldersCaption = _reactForAtom.React.createElement((_Section || _load_Section()).Section, { className: 'nuclide-file-tree-section-caption', headline: 'FOLDERS', size: 'small' });
    }

    // Include `tabIndex` so this component can be focused by calling its native `focus` method.
    return _reactForAtom.React.createElement(
      'div',
      {
        className: 'nuclide-file-tree-toolbar-container',
        onFocus: this._handleFocus,
        tabIndex: 0 },
      uncommittedChangesSection,
      openFilesSection,
      foldersCaption,
      toolbar,
      _reactForAtom.React.createElement(
        (_PanelComponentScroller || _load_PanelComponentScroller()).PanelComponentScroller,
        {
          ref: 'scroller',
          onScroll: this._handleScroll },
        _reactForAtom.React.createElement((_FileTree || _load_FileTree()).FileTree, {
          ref: 'fileTree',
          containerHeight: this.state.scrollerHeight,
          containerScrollTop: this.state.scrollerScrollTop,
          scrollToPosition: this._scrollToPosition
        })
      )
    );
  }

  _processExternalUpdate() {
    const shouldRenderToolbar = !this._store.roots.isEmpty();
    const openFilesUris = this._store.getOpenFilesWorkingSet().getUris();

    if (shouldRenderToolbar !== this.state.shouldRenderToolbar || openFilesUris !== this.state.openFilesUris) {
      this.setState({ shouldRenderToolbar, openFilesUris });
    } else {
      // Note: It's safe to call forceUpdate here because the change events are de-bounced.
      this.forceUpdate();
    }

    // Since we maintain the list of active directories for sidebar, the only way
    // to know if the section is empty or not is by checking each directory entry
    // and checking if they are empty. If all are empty hide the section.
    const uncommittedFileChanges = this._store.getFileChanges();
    const hasUncommittedChanges = Array.from(uncommittedFileChanges.values()).some(fileChanges => fileChanges.size > 0);

    this.setState({ uncommittedFileChanges, hasUncommittedChanges });
  }

  _onFileChosen(filePath) {
    (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('filetree-uncommitted-file-changes-file-open');
    (0, (_goToLocation || _load_goToLocation()).goToLocation)(filePath);
  }

  _handleOpenFilesExpandedChange(isCollapsed) {
    this._actions.setOpenFilesExpanded(!isCollapsed);
  }

  _handleUncommittedFilesExpandedChange(isCollapsed) {
    (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('filetree-uncommitted-file-changes-toggle');
    this._actions.setUncommittedChangesExpanded(!isCollapsed);
  }

  _setModifiedUris() {
    const modifiedUris = getCurrentBuffers().filter(buffer => buffer.isModified()).map(buffer => buffer.getPath() || '').filter(path => path !== '');

    this.setState({ modifiedUris });
  }

  _monitorActiveUri() {
    const activeEditors = (0, (_event || _load_event()).observableFromSubscribeFunction)(atom.workspace.onDidStopChangingActivePaneItem.bind(atom.workspace));

    return new (_UniversalDisposable || _load_UniversalDisposable()).default((0, (_observable || _load_observable()).toggle)(activeEditors, this._showOpenConfigValues).subscribe(editor => {
      if (editor == null || typeof editor.getPath !== 'function' || editor.getPath() == null) {
        this.setState({ activeUri: null });
        return;
      }

      this.setState({ activeUri: editor.getPath() });
    }));
  }

  _updateScrollerHeight() {
    const component = this.refs.scroller;
    if (component == null) {
      return;
    }
    const el = _reactForAtom.ReactDOM.findDOMNode(component);
    if (el == null) {
      return;
    }
    // $FlowFixMe
    this.setState({ scrollerHeight: el.clientHeight });
  }

  _handleScroll() {
    if (!this._scrollWasTriggeredProgrammatically) {
      this._actions.clearTrackedNode();
    }
    this._scrollWasTriggeredProgrammatically = false;
    const node = _reactForAtom.ReactDOM.findDOMNode(this.refs.scroller);
    // $FlowFixMe
    const { scrollTop } = node;
    if (scrollTop !== this.state.scrollerScrollTop) {
      this.setState({ scrollerScrollTop: scrollTop });
    }
  }

  _scrollToPosition(top, height) {
    const requestedBottom = top + height;
    const currentBottom = this.state.scrollerScrollTop + this.state.scrollerHeight;
    if (top > this.state.scrollerScrollTop && requestedBottom <= currentBottom) {
      return; // Already in the view
    }

    const node = _reactForAtom.ReactDOM.findDOMNode(this.refs.scroller);
    if (node == null) {
      return;
    }
    const newTop = Math.max(top + height / 2 - this.state.scrollerHeight / 2, 0);
    setImmediate(() => {
      try {
        // For the rather unlikely chance that the node is already gone from the DOM
        this._scrollWasTriggeredProgrammatically = true;
        // $FlowFixMe
        node.scrollTop = newTop;
        this.setState({ scrollerScrollTop: newTop });
      } catch (e) {}
    });
  }

  isFocused() {
    const el = _reactForAtom.ReactDOM.findDOMNode(this.refs.fileTree);
    if (el == null) {
      return false;
    }
    return el.contains(document.activeElement);
  }

  focus() {
    const el = _reactForAtom.ReactDOM.findDOMNode(this.refs.fileTree);
    if (el == null) {
      return;
    }
    // $FlowFixMe
    el.focus();
  }

  getTitle() {
    return 'File Tree';
  }

  getDefaultLocation() {
    return 'left-panel';
  }

  getPreferredInitialWidth() {
    return 300;
  }

  getURI() {
    return (_Constants || _load_Constants()).WORKSPACE_VIEW_URI;
  }

  didChangeVisibility(visible) {
    this.setState({ hidden: !visible });
  }

  serialize() {
    return {
      deserializer: 'nuclide.FileTreeSidebarComponent'
    };
  }

  copy() {
    // The file tree store wasn't written to support multiple instances, so try to prevent it.
    return false;
  }
}

exports.default = FileTreeSidebarComponent;
function observeAllModifiedStatusChanges() {
  const paneItemChangeEvents = _rxjsBundlesRxMinJs.Observable.merge((0, (_event || _load_event()).observableFromSubscribeFunction)(atom.workspace.onDidAddPaneItem.bind(atom.workspace)), (0, (_event || _load_event()).observableFromSubscribeFunction)(atom.workspace.onDidDestroyPaneItem.bind(atom.workspace))).startWith(undefined);

  return paneItemChangeEvents.map(getCurrentBuffers).switchMap(buffers => _rxjsBundlesRxMinJs.Observable.merge(...buffers.map(buffer => {
    return (0, (_event || _load_event()).observableFromSubscribeFunction)(buffer.onDidChangeModified.bind(buffer));
  })));
}

function getCurrentBuffers() {
  const buffers = [];
  const editors = atom.workspace.getTextEditors();
  editors.forEach(te => {
    const buffer = te.getBuffer();

    if (typeof buffer.getPath !== 'function' || buffer.getPath() == null) {
      return;
    }

    if (buffers.indexOf(buffer) < 0) {
      buffers.push(buffer);
    }
  });

  return buffers;
}

/**
 * Shows the provided menu template. This will result in [an extra call to `templateForEvent()`][1],
 * but it means that we still go through `showMenuForEvent()`, maintaining its behavior wrt
 * (a)synchronousness. See atom/atom#13398.
 *
 * [1]: https://github.com/atom/atom/blob/v1.13.0/src/context-menu-manager.coffee#L200
 */
function showMenuForEvent(event, menuTemplate) {
  if (!(_electron.remote != null)) {
    throw new Error('Invariant violation: "remote != null"');
  }

  const win = _electron.remote.getCurrentWindow();
  const originalEmit = win.emit;
  const restore = () => {
    win.emit = originalEmit;
  };
  win.emit = (eventType, ...args) => {
    if (eventType !== 'context-menu') {
      return originalEmit(eventType, ...args);
    }
    const result = originalEmit('context-menu', menuTemplate);
    restore();
    return result;
  };
  atom.contextMenu.showForEvent(event);
  return new (_UniversalDisposable || _load_UniversalDisposable()).default(restore);
}