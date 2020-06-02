/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /**
 * @fileoverview function blocks for Blockly.
 * @author Philip Thonmas to create function blocks
 */

Blockly.Blocks['function'] = {
  init: function() {
    this.appendValueInput("funcName")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("const", "functionName");
    this.appendValueInput("input")
        .setCheck(null)
        .appendField("=", "(input)");
    this.appendValueInput("func")
        .setCheck(null)
        .appendField("=>", "statement")
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};