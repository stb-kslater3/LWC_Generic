

class Model {

}



class View {
  _plNodes;

  _plNodeIndices;


  updateNodes(plNodes) {
      try {
          this._plNodes = plNodes;
          this._plNodeIndices = {};

          let index = 0;
          this._plNodes.forEach(node => {
              this._plNodeIndices[node.getAttribute('data-id')] = index;

              index += 1;
          });
      }catch(err) {
          console.error('Error in attempt to update plNodes with: ' + plNodes + '\n' + err.message);
      }
  }


  getAttribute(dataId, attributeName) {
      try {
          return this._plNodes[this._plNodeIndices[dataId]][attributeName];
      }catch(err) {
          console.error('Error in attempt to get ' + dataId + '[' + attributeName + ']' + '\n' + err.message);
      }
  }


  setAttribute(dataId, attributeName, attributeValue) {
      try {
          this._plNodes[this._plNodeIndices[dataId]][attributeName] = attributeValue;
      }catch(err) {
          console.error('Error in attempt to set ' + dataId + '[' + attributeName + ']' + '\n' + err.message);
      }
  }


  getElementToCall(dataId) {
      try {
        return this._plNodes[this._plNodeIndices[dataId]];
      }catch(err) {
          console.error('Error in attempt to getElementToCall from plNodes with dataId: ' + dataId + '\n' + err.message);
      }
  }
}



export { Model, View };
