'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIgnoredNames = getIgnoredNames;
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function getIgnoredNames() {
  // $FlowIssue: Filter predicates
  const ignoredNames = atom.config.get('core.ignoredNames');
  if (Array.isArray(ignoredNames)) {
    return ignoredNames.filter(x => typeof x === 'string');
  } else {
    return [];
  }
}