/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'
const LexicalDragon = process.env.NODE_ENV === 'development' ? require('./LexicalDragon.dev.js') : require('./LexicalDragon.prod.js');
module.exports = LexicalDragon;