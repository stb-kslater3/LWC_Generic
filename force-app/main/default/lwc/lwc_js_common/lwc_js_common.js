
class LWC_Toast {
    templateContext;

    constructor(templateContext) {
        this.templateContext = templateContext;
    }

    displayChoice(title, message, variant, mode) {
        const toast = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
        mode: mode
        });

        this.templateContext.dispatchEvent(toast);
    }

    displaySuccess(title, message) {
        const toast = new ShowToastEvent({
        title: title,
        message: message,
        variant: "success",
        mode: "sticky"
        });

        this.templateContext.dispatchEvent(toast);
    }

    displayError(title, userMessage, error) {
        const errorToast = new ShowToastEvent({
        title: title,
        message: userMessage,
        variant: "error",
        mode: "sticky"
        });

        let errorMessage;
        if (error.body) {
        errorMessage = error.body.message;
        } else {
        errorMessage = error.message;
        }
        console.log(
            userMessage,

            "\n\n" + errorMessage,

            "\nOn Line: " + error.lineNumber,

            "\nIn File: " + error.fileName,

            "\n\nStack Trace: " + error.stack,

            "\n"
        );
  
        this.templateContext.dispatchEvent(errorToast);
    }
}




// This is the means of getting/setting attributes. All DOM manipulation is done through this standard interface, and everything
// is referenced by the data-id, which is how it queries that element
class DOM_Interface {
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



  export { LWC_Toast, DOM_Interface };
