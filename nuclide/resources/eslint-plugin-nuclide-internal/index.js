/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @noflow
 */
'use strict';

/* eslint comma-dangle: [1, always-multiline], prefer-object-spread/prefer-object-spread: 0 */

module.exports = {
  rules: {
    'atom-apis': require('./atom-apis'),
    'consistent-import-name': require('./consistent-import-name'),
    'import-type-style': require('./import-type-style'),
    'license-header': require('./license-header'),
    'no-cross-atom-imports': require('./no-cross-atom-imports'),
    'no-unnecessary-disposable-wrapping': require('./no-unnecessary-disposable-wrapping'),
    'prefer-nuclide-uri': require('./prefer-nuclide-uri'),
    'use-nuclide-ui-components': require('./use-nuclide-ui-components'),
  },
  rulesConfig: {
    'atom-apis': 0,
    'consistent-import-name': 0,
    'import-type-style': 0,
    'license-header': 0,
    'no-cross-atom-imports': 0,
    'no-unnecessary-disposable-wrapping': 0,
    'prefer-nuclide-uri': 0,
    'use-nuclide-ui-components': 0,
  },
};
