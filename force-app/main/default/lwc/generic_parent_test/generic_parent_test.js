/*
    This component is for testing out the behavior of HTML, LWC, etc. to ensure we get the appropriate behavior for the generic LWC Interface. This relationship is for an the parent component, so stick the new component under test into this component's HTML.
*/

import { LightningElement, track } from "lwc";

import { NavigationMixin } from 'lightning/navigation';

import { LWC_Toast } from "c/lwc_generic";

//import { Model, View } from "c/lwc_mvc";
import { View } from "c/lwc_mvc";

import queryFromString from "@salesforce/apex/ApexDataInterface.queryFromString";
import insertRecord from "@salesforce/apex/ApexDataInterface.insertRecord";
import updateRecordFromId from "@salesforce/apex/ApexDataInterface.updateRecordFromId";


export default class Generic_parent_test extends NavigationMixin(LightningElement) {
  view;

  currencyFormatter;

  toastHandler;

  @track productList;

  hasLWCGeneric;
  lwcGeneric_Id;


    constructor() {
        super();

        this.view = new View(this.template);

        this.currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        });

        this.toastHandler = new LWC_Toast(this);


        this.productList = [];
    }


    insertViews() {
        this.view.insertElement("OpportunityLookUp");
        this.view.insertElement("OpportunityLink");


        this.view.insertElement("ChassisCost");
        this.view.insertElement("BodyCost");
        this.view.insertElement("Total");


        this.view.insertElement("ShippingAddress");


        this.view.insertElement('GenericName');
        this.view.insertElement('GenericOpportunity');

        this.view.insertElement('GenericStreet');
        this.view.insertElement('GenericCity');
        this.view.insertElement('GenericState');
        this.view.insertElement('GenericCountry');
        this.view.insertElement('GenericPostalCode');
        
        this.view.insertElement('GenericCost');

    }


    setInitialOpportunityLink() {
        this.view.setAttribute("OpportunityLink", "value", '');
        this.view.setAttribute("OpportunityLink", "label", '');
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

    setInitialProductList() {
        this.productList = [];
    }


    setInitialGenerics() {
        this.view.setAttribute('GenericName', 'value', '');

        this.view.setAttribute('GenericOpportunity', 'value', '');

        this.view.setAttribute('GenericStreet', 'value', '');
        this.view.setAttribute('GenericCity', 'value', '');
        this.view.setAttribute('GenericState', 'value', '');
        this.view.setAttribute('GenericCountry', 'value', '');
        this.view.setAttribute('GenericPostalCode', 'value', '');

        this.view.setAttribute('GenericCost', 'value', 0);
    }


    initializeViews() {
        this.setInitialOpportunityLink();

        this.setInitialCosts();

        this.setInitialAddress();

        this.setInitialProductList();

        this.setInitialGenerics();
    }


    handleAddCosts() {
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


    handleInsertGenerics() {
        insertRecord({
            objectName: 'LWC_Generic__c',
            
            fieldValuePairs: {
                'Name': this.view.getAttribute('GenericName', 'value'),

                'Opportunity__c': this.view.getAttribute('OpportunityLookUp', 'value'),

                'Street__c': this.view.getAttribute('GenericStreet', 'value'),
                'City__c': this.view.getAttribute('GenericCity', 'value'),
                'State__c': this.view.getAttribute('GenericState', 'value'),
                'Country__c': this.view.getAttribute('GenericCountry', 'value'),
                'PostalCode__c': this.view.getAttribute('GenericPostalCode', 'value'),

                'Cost__c': Number(this.view.getAttribute('GenericCost', 'value'))
            }
        }).then(isSuccess => {
            if(!isSuccess) {
                this.toastHandler.displayWarning('Failed to Insert LWC_Generic');
            }else {
                this.toastHandler.displaySuccess('LWC_Generic Record Inserted');

                this.hasLWCGeneric = true;
            }
        }).catch(err => {
            this.toastHandler.displayError( err.body ? err.body.message : err.message );
        });
    }

    handleUpdateGenerics() {
        updateRecordFromId({
            objectName: 'LWC_Generic__c',

            recordId: this.lwcGeneric_Id,
            
            fieldValuePairs: {
                'Name': this.view.getAttribute('GenericName', 'value'),

                'Street__c': this.view.getAttribute('GenericStreet', 'value'),
                'City__c': this.view.getAttribute('GenericCity', 'value'),
                'State__c': this.view.getAttribute('GenericState', 'value'),
                'Country__c': this.view.getAttribute('GenericCountry', 'value'),
                'PostalCode__c': this.view.getAttribute('GenericPostalCode', 'value'),

                'Cost__c': Number(this.view.getAttribute('GenericCost', 'value'))
            }
        }).then(isSuccess => {
            if(!isSuccess) {
                this.toastHandler.displayWarning('Failed to Update LWC_Generic');
            }else {
                this.toastHandler.displaySuccess('LWC_Generic Record Updated');
            }
        }).catch(err => {
            this.toastHandler.displayError( err.body ? err.body.message : err.message );
        });
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
            "SELECT Name, Account.ShippingAddress" +
            " FROM Opportunity" +
            " WHERE Id='" +
            this.view.getAttribute("OpportunityLookUp", "value") +
            "'"
        });
    }


    queryGenericFromOpportunity() {
        return queryFromString({
            queryString:
                "SELECT Id, Name, Opportunity__c, Street__c, City__c, State__c, Country__c, PostalCode__c, Cost__c" +
                " FROM LWC_Generic__c" +
                " WHERE Opportunity__c='" +
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
                        try {
                            for (const recordIndex in records) {
                                this.productList.push({
                                    name: records[recordIndex].Product2.RecordType.Name,
                                    
                                    index: this.productList.length
                                });

                                if(records[recordIndex].Product2.List_Price__c) {
                                    this.productList[this.productList.length - 1].cost = this.currencyFormatter.format(records[recordIndex].Product2.List_Price__c);
                                }else {
                                    this.productList[this.productList.length - 1].cost = this.currencyFormatter.format(0);
                                }


                                if (
                                    records[recordIndex].Product2.RecordType.Name === "Chassis" && records[recordIndex].Product2.List_Price__c
                                    ) {
                                    this.view.setAttribute(
                                        "ChassisCost",
                                        "value",
                                        records[recordIndex].Product2.List_Price__c
                                    );
                                } else if (records[recordIndex].Product2.RecordType.Name === "Service Body" && records[recordIndex].Product2.List_Price__c) {
                                    this.view.setAttribute(
                                        "BodyCost",
                                        "value",
                                        records[recordIndex].Product2.List_Price__c
                                    );
                                }
                            }
                        }catch(e) {
                            this.toastHandler.displayError( err.body ? err.body.message : err.message );
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


                    this.view.setAttribute('GenericOpportunity', 'innerHTML', record.Name);


                    this[NavigationMixin.GenerateUrl]({
                        type: 'standard__recordPage',
        
                        attributes: {
                            recordId: this.view.getAttribute("OpportunityLookUp", "value"),
                            actionName: 'view'
                        }
                    }).then(url => {
                        this.view.setAttribute("OpportunityLink", "value", window.location.host + url);

                        if(record) {
                            this.view.setAttribute("OpportunityLink", "label", record.Name);
                        }else {
                            this.view.setAttribute("OpportunityLink", "label", 'Link to Opportunity');
                        }
                    }).catch(err => {
                        this.toastHandler.displayError( err.body ? err.body.message : err.message );
                    });
                }
            }).catch(err => {
                this.toastHandler.displayError( err.body ? err.body.message : err.message );
            });



            this.queryGenericFromOpportunity().then(records => {
                if(records) {
                    if(records.length > 0) {
                        let record = records[0];

                        this.hasLWCGeneric = true;
                        this.lwcGeneric_Id = record.Id;


                        this.view.setAttribute('GenericName', 'value', record.Name);

                        this.view.setAttribute('GenericStreet', 'value', record.Street__c);
                        this.view.setAttribute('GenericCity', 'value', record.City__c);
                        this.view.setAttribute('GenericState', 'value', record.State__c);
                        this.view.setAttribute('GenericCountry', 'value', record.Country__c);
                        this.view.setAttribute('GenericPostalCode', 'value', record.PostalCode__c);

                        this.view.setAttribute('GenericCost', 'value', record.Cost__c);
                    }else {
                        this.toastHandler.displayInfo('No LWC_Generic found for this Opportunity');

                        this.hasLWCGeneric = false;
                    }
                }
            }).catch(err => {
                this.toastHandler.displayError( err.body ? err.body.message : err.message );
            });
        }
    }



    renderedCallback() {
        this.insertViews();
    }
}
