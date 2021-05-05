

class View {
    domElements;
    templateContext;
  
    constructor(templateContext) {
      this.domElements = {};
  
      this.templateContext = templateContext;
    }
  
    checkForElement(dataId) {
      let hasElement = false;

      if (dataId in this.domElements) {
        hasElement = true;
      }
  
      return hasElement;
    }
  
    insertElement(dataId) {
      let queryResult;
  
      if (!this.checkForElement(dataId)) {
        queryResult = this.templateContext.querySelector(
          "[data-id='" + dataId + "']"
        );
      }
  
      if (queryResult) {
        this.domElements[dataId] = queryResult;
      }
    }
  
    removeElement(dataId) {
      delete this.domElements[dataId];
    }
  
    getAttribute(dataId, attributeName) {
      return this.domElements[dataId][attributeName];
    }
  
    setAttribute(dataId, attributeName, value) {
      this.domElements[dataId][attributeName] = value;
    }
}



export { View };
