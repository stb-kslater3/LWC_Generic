

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
          console.log(err.message);
      }
  }


  getAttribute(dataId, attributeName) {
      try {
          return this._plNodes[this._plNodeIndices[dataId]][attributeName];
      }catch(err) {
          console.log('ERROR: ' + err.message);
          console.log('In attempt to get ' + dataId + '[' + attributeName + ']');
      }
  }

  setAttribute(dataId, attributeName, attributeValue) {
      try {
          this._plNodes[this._plNodeIndices[dataId]][attributeName] = attributeValue;
      }catch(err) {
          console.log('ERROR: ' + err.message);
          console.log('In attempt to set ' + dataId + '[' + attributeName + ']');
      }
  }
}



export { View };
