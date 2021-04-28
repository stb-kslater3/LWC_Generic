
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


    displayInfo(message) {
        const toast = new ShowToastEvent({
            title: 'Info',
            message: message,
            variant: "info",
            mode: "sticky"
        });

        this.templateContext.dispatchEvent(toast);
    }


    displayWarning(message) {
        const toast = new ShowToastEvent({
            title: 'Warning',
            message: message,
            variant: "warning",
            mode: "sticky"
        });

        this.templateContext.dispatchEvent(toast);
    }


    displaySuccess(message) {
        const toast = new ShowToastEvent({
            title: 'Success',
            message: message,
            variant: "success",
            mode: "sticky"
        });

        this.templateContext.dispatchEvent(toast);
    }


    displayError(errorMessage) {
        const toast = new ShowToastEvent({
            title: 'Error',
            message: errorMessage,
            variant: "error",
            mode: "sticky"
        });
  
        this.templateContext.dispatchEvent(toast);
    }
}



  export { LWC_Toast };
