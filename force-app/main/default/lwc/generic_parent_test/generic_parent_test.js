/*
    This component is for testing out the behavior of HTML, LWC, etc. to ensure we get the appropriate behavior for the generic LWC Interface. Each LWC I make can be made to interact with other components through these relationships. This relationship is for an unrelated component that may be on the same page, but must be communicated with through the lightning message channel.
*/

import { LightningElement } from "lwc";

import { LWC_Toast, DOM_Interface } from "c/lwc_js_common";

import queryFromString from "@salesforce/apex/ApexDataInterface.queryFromString";


export default class Generic_parent_test extends LightningElement {
  domInterface;

  currencyFormatter;

  toastHandler;

  constructor() {
    super();

    this.domInterface = new DOM_Interface(this.template);

    this.currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    });

    this.toastHandler = new LWC_Toast(this);
  }

  initializeCosts() {
    this.domInterface.setAttribute("ChassisCost", "value", "0");
    this.domInterface.setAttribute("BodyCost", "value", "0");
  }

  initializeDOMInterface() {
    this.domInterface.insertElement("OpportunityLookUp");
    this.domInterface.insertElement("OpportunityLink");

    this.domInterface.insertElement("ChassisCost");
    this.domInterface.insertElement("BodyCost");
    this.domInterface.insertElement("Total");

    this.initializeCosts();
  }

  addCosts() {
    let sumOfCosts = 0;

    if (this.domInterface.checkForElement("Total")) {
      if (
        this.domInterface.checkForElement("ChassisCost") &&
        this.domInterface.checkForElement("BodyCost")
      ) {
        sumOfCosts =
          Number(this.domInterface.getAttribute("ChassisCost", "value")) +
          Number(this.domInterface.getAttribute("BodyCost", "value"));
      }

      this.domInterface.setAttribute(
        "Total",
        "innerHTML",
        this.currencyFormatter.format(sumOfCosts)
      );
    }
  }

  queryCostsFromOpportunity() {
    return queryFromString({
      queryString:
        "SELECT Product2.RecordType.Name, Product2.List_Price__c" +
        " FROM OpportunityLineItem" +
        " WHERE OpportunityId='" +
        this.domInterface.getAttribute("OpportunityLookUp", "value") +
        "'"
    });
  }

  handleOpportunityChosen(event) {
    // Make sure to clear out these values for the new ones, in case one of them doesn't have a record
    this.initializeCosts();

    if (event.detail.value.length > 0) {
      // Checking if this component has a value is nasty, this is how to do it
      this.queryCostsFromOpportunity()
        .then((records) => {
          let record;

          if (records) {
            if (records.length === 0) {
              this.toastHandler.displayChoice(
                "Note:",

                "No products found were found for this Opportunity",

                "info",

                "sticky"
              );
            } else {
              for (const recordIndex in records) {
                if (
                  records[recordIndex].Product2.RecordType.Name === "Chassis"
                ) {
                  this.domInterface.setAttribute(
                    "ChassisCost",
                    "value",
                    records[recordIndex].Product2.List_Price__c
                  );
                } else if (
                  records[recordIndex].Product2.RecordType.Name ===
                  "Service Body"
                ) {
                  this.domInterface.setAttribute(
                    "BodyCost",
                    "value",
                    records[recordIndex].Product2.List_Price__c
                  );
                } else {
                  this.toastHandler.displayChoice(
                    "Note:",

                    "An product found wasn't of type Chassis or Service Body, but rather of type " +
                      record.Product2.RecordType.Name,

                    "info",

                    "sticky"
                  );
                }
              }
            }
          }
        })
        .catch((err) => {
          this.toastHandler.displayError(
            "Error",
            "An error occurred when handling queryCostsFromOpportunity()",
            err
          );
        });
    }
  }

  renderedCallback() {
    this.initializeDOMInterface();
  }
}
