import { ShowToastEvent } from "lightning/platformShowToastEvent";

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

class Attribute_Handler {
  attributeType;

  constructor(attributeType) {
    this.attributeType = attributeType;
  }

  getAttribute(element, attribute) {
    let value = element[attribute];

    if (
      (this.attributeType === "number" ||
        this.attributeType === "currency" ||
        this.attributeType === "percent") &&
      attribute === "value"
    ) {
      return Number(value);
    } else {
      return value;
    }
  }

  setAttribute(element, attribute, value) {
    if (this.attributeType === "currency" && attribute === "value") {
      if (value) {
        element[attribute] = value.toFixed(2);
      } else {
        element[attribute] = 0.0;
      }
    } else if (this.attributeType === "percent" && attribute === "value") {
      if (value) {
        element[attribute] = value.toFixed(4);
      } else {
        element[attribute] = 0.0;
      }
    } else {
      element[attribute] = value;
    }
  }
}

class LWC_Element {
  // The Id used to query the dom for this specific element
  dataId;

  // So that I can access the this of the Element
  templateReference;

  // The reference to the dom element itself so its attributes can be read and written to and
  // event listeners added, etc.
  domElement;

  // To ensure the dom is queried only once, since renderedCallback is run multiple times
  isInitialized;

  apiFieldName;

  // Because Javascript has crappy typing, I need this to get number rather than string back and
  // those sorts of things. Otherwise getting values concatenates numbers etc.
  attributeHandler;

  // Collection of events and their callbacks to register on initilization with addeventlistener
  eventsObject;

  constructor(dataId, templateReference, attributeHandler, eventsObject) {
    this.dataId = dataId;

    this.isInitialized = false;

    this.templateReference = templateReference;

    this.attributeHandler = attributeHandler;

    this.eventsObject = eventsObject;
  }

  setApiFieldName(fieldName) {
    this.apiFieldName = fieldName;
  }

  initialize() {
    this.domElement = this.templateReference.querySelector(
      "[data-id='" + this.dataId + "']"
    );

    this.isInitialized = true;

    for (let key in this.eventsObject) {
      this.domElement.addEventListener(key, this.eventsObject[key]);
    }
  }

  getAttribute(name) {
    return this.attributeHandler.getAttribute(this.domElement, name);
  }

  setAttribute(name, value) {
    this.attributeHandler.setAttribute(this.domElement, name, value);
  }
}

export { LWC_Toast, LWC_Element, Attribute_Handler };
