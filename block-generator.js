/**
 * Copyright 2018 Text2Code Authors
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
 * @fileoverview Uses blueprint from parse tree and creates blocks from it;
 * includes functions for modifying blocks
 * @author Jason Schanker
 */

"use strict";

var createBlocks = (function() {
	function setValueInput(sourceBlock, inputName, inputBlock) {
      var blockInput = sourceBlock && sourceBlock.getInput(inputName);
      var valueBlockConnection = inputBlock && inputBlock.outputConnection;
      
      if(blockInput && valueBlockConnection) {
        blockInput.connection.connect(valueBlockConnection);
      }
    }
	function moveInputBlock(sourceBlock, destinationBlock, sourceInputName, destinationInputName) {
	  var inputBlock = sourceBlock && sourceBlock.getInputTargetBlock(sourceInputName);
	  destinationInputName = typeof destinationInputName === "undefined" ? 
	                         sourceInputName : destinationInputName;
	  setValueInput(destinationBlock, destinationInputName, inputBlock);
	}

	function moveToSameLocation(sourceBlock, targetBlock) {
      if(sourceBlock && targetBlock) {
        targetBlock.moveBy(sourceBlock.getRelativeToSurfaceXY().x - targetBlock.getRelativeToSurfaceXY().x,
                           sourceBlock.getRelativeToSurfaceXY().y - targetBlock.getRelativeToSurfaceXY().y);
      }
  }

    function copyBlock(block, deep) {
      if(!block) return null;
      
      var blockCp = workspace.newBlock(block.type);
      block.inputList.forEach(function(input) {
        input.fieldRow.forEach(function(field) {
            blockCp.setFieldValue(field.getValue(), field.name);
        });
      });
      
      if(deep) {
        block.getChildren().slice().forEach(function(childBlock) {
      	  if(block.getNextBlock() !== childBlock) {
            var blockInput = block.getInputWithBlock(childBlock);
            setValueInput(blockCp, blockInput.name, copyBlock(childBlock, true));
          }
        });
      }
      
      return blockCp;
    }

    function createNewTempVariable(prefix) {
      // get next unused temp variable name
      var tempVariableName = prefix || "temp";
      var index = 1;
      
      while(workspace.variableIndexOf(tempVariableName + index) !== -1) { //deprecated
        index++;
      }
      tempVariableName += index; 
      workspace.createVariable(tempVariableName, "STRING");
      return tempVariableName;
    }

    function getParentStatementBlock(block) {
      if(!block) return null;
      var parentBlock = block.getParent();
      while(parentBlock && !parentBlock.previousConnection) {
        parentBlock = parentBlock.getParent();
      }
      return parentBlock;
    }

    function replaceWithBlock(block, replaceBlock, dispose) {
      var parentBlock = block.getParent();
      var parentInput = null;
      var parentConnection = null;
      var blockConnectionType = -1;

      block.inputList.forEach(function(input) {
        input.fieldRow.forEach(function(field) {
          if(replaceBlock.getField(field.name)) {
            replaceBlock.setFieldValue(field.getValue(), field.name);
          }
        });
      });
      
      if(parentBlock) {
      	parentInput = parentBlock.getInputWithBlock(block);
        parentConnection = parentInput ? parentInput.connection : parentBlock.nextConnection;
        blockConnectionType = parentConnection.targetConnection.type;
        if(blockConnectionType === Blockly.OUTPUT_VALUE) {
          parentConnection.connect(replaceBlock.outputConnection);
        }
        else if(blockConnectionType === Blockly.PREVIOUS_STATEMENT) {
          parentConnection.connect(replaceBlock.previousConnection);
        }
      } else {
        replaceBlock.moveBy(block.getRelativeToSurfaceXY().x - replaceBlock.getRelativeToSurfaceXY().x,
                            block.getRelativeToSurfaceXY().y - replaceBlock.getRelativeToSurfaceXY().y);
      }
      
      block.getChildren().slice().forEach(function(childBlock) {
      	if(block.getNextBlock() !== childBlock) {
      		// assume the child block connection is INPUT_VALUE/OUTPUT_VALUE since it's not 
      		// PREVIOUS_STATEMENT/NEXT_STATEMENT
      		var blockInput = block.getInputWithBlock(childBlock);
      		var replaceBlockInput = replaceBlock.getInput(blockInput.name);
      		if(replaceBlockInput) {
      		  blockInput = replaceBlockInput.connection.connect(childBlock.outputConnection);
      		}
      	}
      	else {
      		replaceBlock.nextConnection.connect(block.getNextBlock().previousConnection);
      	}
      });

      if(dispose) block.dispose();
      return replaceBlock;
    }

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