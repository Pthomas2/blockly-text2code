/**
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *            &
 * Copyright 2018 Text2Code Authors
 * https://github.com/Pthomas2/blockly-text2code
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
 * @fileoverview Generating JavaScript for text blocks.
 * @author (Initial Block Function Definitions) fraser@google.com (Neil Fraser)
 *         (All Other Code/Modifications to Block Definitions) Jason Schanker
 */

Blockly.JavaScript['functionCode'] = function(block) {
  var value_funcname = Blockly.JavaScript.valueToCode(block, 'funcName', Blockly.JavaScript.ORDER_ATOMIC);
  var value_input = Blockly.JavaScript.valueToCode(block, 'input', Blockly.JavaScript.ORDER_ATOMIC);
  var variable_vari = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('vari'), Blockly.Variables.NAME_TYPE);
  var value_func = Blockly.JavaScript.valueToCode(block, 'func', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = ;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['function'] = functionCode.bind(null, 'function');