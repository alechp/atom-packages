'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwiftPMTaskRunner = undefined;

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _reactForAtom = require('react-for-atom');

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('../../../commons-node/UniversalDisposable'));
}

var _fsPromise;

function _load_fsPromise() {
  return _fsPromise = _interopRequireDefault(require('../../../commons-node/fsPromise'));
}

var _process;

function _load_process() {
  return _process = require('../../../commons-node/process');
}

var _event;

function _load_event() {
  return _event = require('../../../commons-node/event');
}

var _tasks;

function _load_tasks() {
  return _tasks = require('../../../commons-node/tasks');
}

var _SwiftPMTaskRunnerStore;

function _load_SwiftPMTaskRunnerStore() {
  return _SwiftPMTaskRunnerStore = _interopRequireDefault(require('./SwiftPMTaskRunnerStore'));
}

var _SwiftPMTaskRunnerActions;

function _load_SwiftPMTaskRunnerActions() {
  return _SwiftPMTaskRunnerActions = _interopRequireDefault(require('./SwiftPMTaskRunnerActions'));
}

var _SwiftPMTaskRunnerDispatcher;

function _load_SwiftPMTaskRunnerDispatcher() {
  return _SwiftPMTaskRunnerDispatcher = _interopRequireDefault(require('./SwiftPMTaskRunnerDispatcher'));
}

var _SwiftPMTaskRunnerCommands;

function _load_SwiftPMTaskRunnerCommands() {
  return _SwiftPMTaskRunnerCommands = require('./SwiftPMTaskRunnerCommands');
}

var _SwiftPMTaskRunnerTaskMetadata;

function _load_SwiftPMTaskRunnerTaskMetadata() {
  return _SwiftPMTaskRunnerTaskMetadata = require('./SwiftPMTaskRunnerTaskMetadata');
}

var _SwiftPMTaskRunnerToolbar;

function _load_SwiftPMTaskRunnerToolbar() {
  return _SwiftPMTaskRunnerToolbar = _interopRequireDefault(require('./toolbar/SwiftPMTaskRunnerToolbar'));
}

var _SwiftPMAutocompletionProvider;

function _load_SwiftPMAutocompletionProvider() {
  return _SwiftPMAutocompletionProvider = _interopRequireDefault(require('./providers/SwiftPMAutocompletionProvider'));
}

var _Icon;

function _load_Icon() {
  return _Icon = require('../../../nuclide-ui/Icon');
}

var _nullthrows;

function _load_nullthrows() {
  return _nullthrows = _interopRequireDefault(require('nullthrows'));
}

var _nuclideUri;

function _load_nuclideUri() {
  return _nuclideUri = _interopRequireDefault(require('../../../commons-node/nuclideUri.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The primary controller for spawning SwiftPM tasks, such as building a
 * package, or running its tests. This class conforms to Nuclide's TaskRunner
 * interface.
 */


/**
 * nuclide-swift makes use of the Flux design pattern. The SwiftPMTaskRunner is
 * responsible for kicking off SwiftPM tasks such as building a package. How it
 * builds the package is determined by the state of the
 * SwiftPMTaskRunnerToolbar -- the path to the package, whether a build path is
 * specified, etc. -- and that state is maintained by the
 * SwiftPMTaskRunnerStore. Updates to the toolbar UI options trigger actions,
 * defined in SwiftPMTaskRunnerActions, which update the state of the store.
 * Actions are routed to the store via a Flux.Dispatcher (instantiated by
 * SwiftPMTaskRunner).
 */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

class SwiftPMTaskRunner {

  constructor(initialState) {
    this.id = 'swiftpm';
    this.name = 'Swift';
    this._initialState = initialState;
    this._outputMessages = new _rxjsBundlesRxMinJs.Subject();
    this._projectRoot = new _rxjsBundlesRxMinJs.Subject();
    this._disposables = new (_UniversalDisposable || _load_UniversalDisposable()).default(this._outputMessages, this._projectRoot.subscribe(path => this._getFlux().actions.updateProjectRoot(path)));
  }

  dispose() {
    this._disposables.dispose();
  }

  serialize() {
    return this._getFlux().store.serialize();
  }

  getExtraUi() {
    const { store, actions } = this._getFlux();
    return class ExtraUi extends _reactForAtom.React.Component {
      render() {
        return _reactForAtom.React.createElement((_SwiftPMTaskRunnerToolbar || _load_SwiftPMTaskRunnerToolbar()).default, {
          store: store,
          actions: actions
        });
      }
    };
  }

  getIcon() {
    return () => _reactForAtom.React.createElement((_Icon || _load_Icon()).Icon, { icon: 'nuclicon-swift', className: 'nuclide-swift-task-runner-icon' });
  }

  runTask(taskName) {
    const store = this._getFlux().store;
    const chdir = (0, (_nullthrows || _load_nullthrows()).default)(store.getProjectRoot());
    const configuration = store.getConfiguration();
    const buildPath = store.getBuildPath();

    let command;
    switch (taskName) {
      case (_SwiftPMTaskRunnerTaskMetadata || _load_SwiftPMTaskRunnerTaskMetadata()).SwiftPMTaskRunnerBuildTaskMetadata.type:
        command = (0, (_SwiftPMTaskRunnerCommands || _load_SwiftPMTaskRunnerCommands()).buildCommand)(chdir, configuration, store.getXcc(), store.getXlinker(), store.getXswiftc(), buildPath);
        break;
      case (_SwiftPMTaskRunnerTaskMetadata || _load_SwiftPMTaskRunnerTaskMetadata()).SwiftPMTaskRunnerTestTaskMetadata.type:
        command = (0, (_SwiftPMTaskRunnerCommands || _load_SwiftPMTaskRunnerCommands()).testCommand)(chdir, buildPath);
        break;
      default:
        throw new Error(`Unknown task name: ${taskName}`);
    }

    atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-console:toggle', { visible: true });
    this._logOutput(`${command.command} ${command.args.join(' ')}`, 'log');

    const observable = (0, (_process || _load_process()).observeProcess)(() => (0, (_process || _load_process()).safeSpawn)(command.command, command.args)).do(message => {
      switch (message.kind) {
        case 'stderr':
        case 'stdout':
          this._logOutput(message.data, 'log');
          break;
        case 'exit':
          if (message.exitCode === 0) {
            this._logOutput(`${command.command} exited successfully.`, 'success');
            this._getFlux().actions.updateCompileCommands(chdir, configuration, buildPath);
          } else {
            this._logOutput(`${command.command} failed with ${(0, (_process || _load_process()).exitEventToMessage)(message)}`, 'error');
          }
          break;
        default:
          break;
      }
    }).ignoreElements();

    const task = (0, (_tasks || _load_tasks()).taskFromObservable)(observable);
    return Object.assign({}, task, {
      cancel: () => {
        this._logOutput('Task cancelled.', 'warning');
        task.cancel();
      }
    });
  }

  getAutocompletionProvider() {
    if (!this._autocompletionProvider) {
      this._autocompletionProvider = new (_SwiftPMAutocompletionProvider || _load_SwiftPMAutocompletionProvider()).default(this._getFlux().store);
    }
    return this._autocompletionProvider;
  }

  getOutputMessages() {
    return this._outputMessages;
  }

  setProjectRoot(projectRoot, callback) {
    const path = projectRoot == null ? null : projectRoot.getPath();

    const storeReady = (0, (_event || _load_event()).observableFromSubscribeFunction)(this._getFlux().store.subscribe.bind(this._getFlux().store)).map(() => this._getFlux().store).startWith(this._getFlux().store).filter(store => store.getProjectRoot() === path).share();

    const enabledObservable = storeReady.map(store => store.getProjectRoot()).distinctUntilChanged().switchMap(root => {
      if (!root || (_nuclideUri || _load_nuclideUri()).default.isRemote(root)) {
        return _rxjsBundlesRxMinJs.Observable.of(false);
      }
      return this._packageFileExistsAtPath(root);
    }).distinctUntilChanged();

    const tasksObservable = storeReady.map(store => (_SwiftPMTaskRunnerTaskMetadata || _load_SwiftPMTaskRunnerTaskMetadata()).SwiftPMTaskRunnerTaskMetadata);

    const subscription = _rxjsBundlesRxMinJs.Observable.combineLatest(enabledObservable, tasksObservable).subscribe(([enabled, tasks]) => callback(enabled, tasks));

    this._projectRoot.next(path);

    return new (_UniversalDisposable || _load_UniversalDisposable()).default(subscription);
  }

  _packageFileExistsAtPath(path) {
    return (0, _asyncToGenerator.default)(function* () {
      return (_fsPromise || _load_fsPromise()).default.exists((_nuclideUri || _load_nuclideUri()).default.join(path, 'Package.swift'));
    })();
  }

  _logOutput(text, level) {
    this._outputMessages.next({ text, level });
  }

  _getFlux() {
    if (!this._flux) {
      const dispatcher = new (_SwiftPMTaskRunnerDispatcher || _load_SwiftPMTaskRunnerDispatcher()).default();
      const store = new (_SwiftPMTaskRunnerStore || _load_SwiftPMTaskRunnerStore()).default(dispatcher, this._initialState);
      this._disposables.add(store);
      const actions = new (_SwiftPMTaskRunnerActions || _load_SwiftPMTaskRunnerActions()).default(dispatcher);
      this._flux = { store, actions };
    }
    return this._flux;
  }
}
exports.SwiftPMTaskRunner = SwiftPMTaskRunner;