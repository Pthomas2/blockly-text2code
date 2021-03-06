/**
 * Copyright 2018-2020 Text2Code Authors
 * https://github.com/jschanker/blockly-text2code
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
 * @fileoverview Uses blueprint from parse tree and creates blocks from it
 * @author Jason Schanker
 */

"use strict";

var createBlocks = (function() {

    function createBlocks(blocksBlueprint) {
      var block;
      if(blocksBlueprint && blocksBlueprint.type) {
        block = workspace.newBlock(blocksBlueprint.type);
        if(blocksBlueprint.inputs) {
          Object.keys(blocksBlueprint.inputs).forEach(function(blockInputName) {
            setValueInput(block, blockInputName, createBlocks(blocksBlueprint.inputs[blockInputName]));
          });
        }
        if(blocksBlueprint && blocksBlueprint.fields) {
          Object.keys(blocksBlueprint.fields).forEach(function(blockFieldName) {
            block.setFieldValue(blocksBlueprint.fields[blockFieldName], blockFieldName);
          });         
        }

        return block;
      }
      else if(blocksBlueprint && Array.isArray(blocksBlueprint.blocks)) {
        var blocks = blocksBlueprint.blocks.map(createBlocks);
        for(var i = 0; i < blocks.length-1; i++) {
          if(!blocks[i].getNextBlock() && !blocks[i+1].getPreviousBlock()) {
            setNextBlock(blocks[i], blocks[i+1]);
          }
        }
        return blocks[0];
      }
    }

    return (function(blocksBlueprint, codeBlockToReplace) {
      let block = createBlocks(blocksBlueprint);
      replaceWithBlock(codeBlockToReplace, block, true);
      
      // THIS SNIPPET OF CODE FOR REFRESHING THE WORKSPACE
      // AFTER THE CODE BLOCK IS REPLACED CAME FROM 
      // (I THINK) @author fraser@google.com (Neil Fraser): 
      // https://github.com/google/blockly/blob/4e42a1b78ee7bce8f6c4ae8a6600bfc6dbcc3209/demos/code/code.js
      // IS THERE ANOTHER WAY?
      var xmlDom = Blockly.Xml.workspaceToDom(workspace);
      if (xmlDom) {
        workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
      }

      return block;
    });
})();
