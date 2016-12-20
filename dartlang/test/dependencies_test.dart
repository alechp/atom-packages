// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

library atom.dependencies_test;

import 'package:atom/utils/dependencies.dart';
import 'package:test/test.dart';

main() => defineTests();

defineTests() {
  group('dependencies', () {
    test('retrieve dependency', () {
      Dependencies dependency = new Dependencies();
      expect(dependency[String], isNull);
      dependency[String] = 'foo';
      expect(dependency[String], isNotNull);
      expect(dependency[String], 'foo');
    });

    test('runInZone', () {
      expect(Dependencies.instance, isNull);
      Dependencies dependency = new Dependencies();
      expect(Dependencies.instance, isNull);
      dependency[String] = 'foo';
      dependency.runInZone(() {
        expect(Dependencies.instance, isNotNull);
        expect(dependency[String], 'foo');
      });
      expect(Dependencies.instance, isNull);
    });
  });
}
