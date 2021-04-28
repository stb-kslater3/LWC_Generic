/*
    This component is for testing out the behavior of HTML, LWC, etc. to ensure we get the appropriate behavior for the generic LWC Interface. This relationship is for an the parent component, so stick the new component under test into this component's HTML.
*/

import { LightningElement } from "lwc";

import { LWC_Toast } from "c/lwc_generic";

//import { Model, View } from "c/lwc_mvc";
import { View } from "c/lwc_mvc";

import queryFromString from "@salesforce/apex/ApexDataInterface.queryFromString";


export default class Generic_parent_test extends LightningElement {
  view;

  currencyFormatter;

  toastHandler;



    constructor() {
        super();

        this.view = new View(this.template);

        this.currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        });

        this.toastHandler = new LWC_Toast(this);
    }


    insertViews() {
        this.view.insertElement("OpportunityLookUp");
        this.view.insertElement("OpportunityLink");


        this.view.insertElement("ChassisCost");
        this.view.insertElement("BodyCost");
        this.view.insertElement("Total");


        this.view.insertElement("ShippingAddress");
    }


    setInitialCosts() {
        this.view.setAttribute("ChassisCost", "value", "0");
        this.view.setAttribute("BodyCost", "value", "0");
    }

    setInitialAddress() {
        this.view.setAttribute('ShippingAddress', 'street', '');
        this.view.setAttribute('ShippingAddress', 'city', '');
        this.view.setAttribute('ShippingAddress', 'province', '');
        this.view.setAttribute('ShippingAddress', 'country', '');
        this.view.setAttribute('ShippingAddress', 'postalCode', '');
    }


    initializeViews() {
        this.setInitialCosts();

        this.setInitialAddress();
    }



    addCosts() {
        let sumOfCosts = 0;

        if (this.view.checkForElement("Total")) {
        if (
            this.view.checkForElement("ChassisCost") &&
            this.view.checkForElement("BodyCost")
        ) {
            sumOfCosts =
            Number(this.view.getAttribute("ChassisCost", "value")) +
            Number(this.view.getAttribute("BodyCost", "value"));
        }

        this.view.setAttribute(
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
            this.view.getAttribute("OpportunityLookUp", "value") +
            "'"
        });
    }


    queryAddressFromOpportunity() {
        return queryFromString({
        queryString:
            "SELECT Account.ShippingAddress" +
            " FROM Opportunity" +
            " WHERE Id='" +
            this.view.getAttribute("OpportunityLookUp", "value") +
            "'"
        });
    }



    handleOpportunityChosen(event) {
        // Make sure to clear out these values for the new ones, in case one of them doesn't have a record
        this.initializeViews();

        if (event.detail.value.length > 0) {
            // Checking if this component has a value is nasty, this is how to do it
            this.queryCostsFromOpportunity().then((records) => {
                let record;

                if (records) {
                    if (records.length === 0) {
                        this.toastHandler.displayInfo('No products found were found for this Opportunity');
                    } else {
                    for (const recordIndex in records) {
                        if (
                            records[recordIndex].Product2.RecordType.Name === "Chassis"
                            ) {
                            this.view.setAttribute(
                                "ChassisCost",
                                "value",
                                records[recordIndex].Product2.List_Price__c
                            );
                        } else if (records[recordIndex].Product2.RecordType.Name === "Service Body") {
                            this.view.setAttribute(
                                "BodyCost",
                                "value",
                                records[recordIndex].Product2.List_Price__c
                            );
                        }
                    }
                    }
                }
            }).catch((err) => {
                this.toastHandler.displayError( err.body ? err.body.message : err.message );
            });



            this.queryAddressFromOpportunity().then(records => {
                let record;

                if (records) {
                    record = records[0];

                    if(record.Account.ShippingAddress) {
                        this.view.setAttribute('ShippingAddress', 'street', record.Account.ShippingAddress.street);
                        this.view.setAttribute('ShippingAddress', 'city', record.Account.ShippingAddress.city);
                        this.view.setAttribute('ShippingAddress', 'province', record.Account.ShippingAddress.state);
                        this.view.setAttribute('ShippingAddress', 'country', record.Account.ShippingAddress.country);
                        this.view.setAttribute('ShippingAddress', 'postalCode', record.Account.ShippingAddress.postalCode);
                    }else {
                        this.toastHandler.displayInfo('No ShippingAddress found for this Opportunity');
                    }
                }
            }).catch(err => {
                this.toastHandler.displayError( err.body ? err.body.message : err.message );
            });
        }




    }



    renderedCallback() {
        this.insertViews();

        this.initializeViews();
    }
}
