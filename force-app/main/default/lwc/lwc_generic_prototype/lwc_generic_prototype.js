
import { ShowToastEvent } from "lightning/platformShowToastEvent";


class LWC_Toast {
    templateContext;


    constructor(templateContext) {
        this.templateContext = templateContext;
    }


    displayChoice(title, message, variant, mode) {
        try {
            const toast = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: mode
            });

            this.templateContext.dispatchEvent(toast);
        }catch(err) {
            console.error(err.oby ? err.body.message : err.message);
        }
    }


    displayInfo(message) {
        try {
            const toast = new ShowToastEvent({
                title: 'Info',
                message: message,
                variant: "info",
                mode: "sticky"
            });

            this.templateContext.dispatchEvent(toast);
        }catch(err) {
            console.error(err.oby ? err.body.message : err.message);
        }
    }


    displayWarning(message) {
        try {
            const toast = new ShowToastEvent({
                title: 'Warning',
                message: message,
                variant: "warning",
                mode: "sticky"
            });

            this.templateContext.dispatchEvent(toast);
        }catch(err) {
            console.error(err.oby ? err.body.message : err.message);
        }
    }


    displaySuccess(message) {
        try {
            const toast = new ShowToastEvent({
                title: 'Success',
                message: message,
                variant: "success",
                mode: "sticky"
            });

            this.templateContext.dispatchEvent(toast);
        }catch(err) {
            console.error(err.oby ? err.body.message : err.message);
        }
    }


    displayError(errorMessage) {
        try {
            const toast = new ShowToastEvent({
                title: 'Error',
                message: errorMessage,
                variant: "error",
                mode: "sticky"
            });
    
            this.templateContext.dispatchEvent(toast);
        }catch(err) {
            console.error(err.oby ? err.body.message : err.message);
        }
    }
}



  export { LWC_Toast };
