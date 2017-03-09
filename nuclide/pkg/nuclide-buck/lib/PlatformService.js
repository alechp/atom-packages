'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlatformService = undefined;

var _atom = require('atom');

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

class PlatformService {
  constructor() {
    this._registeredProviders = [];
    this._providersChanged = new _rxjsBundlesRxMinJs.Subject();
  }

  register(platformProvider) {
    this._registeredProviders.push(platformProvider);
    this._providersChanged.next();
    return new _atom.Disposable(() => {
      const index = this._registeredProviders.indexOf(platformProvider);
      this._registeredProviders.splice(index, 1);
      this._providersChanged.next();
    });
  }

  getPlatformGroups(buckRoot, ruleType, buildTarget) {
    return this._providersChanged.startWith(undefined).switchMap(() => {
      const observables = this._registeredProviders.map(provider => provider(buckRoot, ruleType, buildTarget));
      return _rxjsBundlesRxMinJs.Observable.from(observables)
      // $FlowFixMe: type combineAll
      .combineAll().map(platformGroups => {
        return platformGroups.filter(p => p != null).sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
      });
    });
  }
}
exports.PlatformService = PlatformService; /**
                                            * Copyright (c) 2015-present, Facebook, Inc.
                                            * All rights reserved.
                                            *
                                            * This source code is licensed under the license found in the LICENSE file in
                                            * the root directory of this source tree.
                                            *
                                            * 
                                            */