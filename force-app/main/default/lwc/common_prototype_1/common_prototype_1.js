/*
    This component is for testing out the behavior of HTML, LWC, etc. to ensure we get the appropriate behavior for the generic LWC Interface. This relationship is for an the parent component, so stick the new component under test into this component's HTML.
*/

import { LightningElement, track } from "lwc";

import { NavigationMixin } from 'lightning/navigation';

import { LWC_Toast } from "c/lwc_generic_prototype";

import queryFromString from "@salesforce/apex/Apex_Generic_Prototype.queryFromString";
import insertRecord from "@salesforce/apex/Apex_Generic_Prototype.insertRecord";
import updateRecordFromId from "@salesforce/apex/Apex_Generic_Prototype.updateRecordFromId";


import { View } from "c/lwc_mvc_prototype2";



export default class Common_prototype_1 extends NavigationMixin(LightningElement) {
    view;

    currencyFormatter;

    toastHandler;

    @track productList;

    hasLWCGeneric;
    lwcGeneric_Id;

    @track lwcDynamicList;


    constructor() {
        super();

        this.view = new View();

        this.currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        });

        this.toastHandler = new LWC_Toast(this);


        this.productList = [];

        this.lwcDynamicList = [];
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


    setInitialAddDynamics() {
        /*
        if(this.view.checkForElement('addDynamicName')) {
            this.view.setAttribute('addDynamicName', 'value', '');
            this.view.setAttribute('addDynamicText', 'value', '');
            this.view.setAttribute('addDynamicNumber', 'value', 0);
        }
        */

        this.view.setAttribute('addDynamicName', 'value', '');
        this.view.setAttribute('addDynamicText', 'value', '');
        this.view.setAttribute('addDynamicNumber', 'value', 0);
    }


    setInitialLWCDynamicsList() {
        this.lwcDynamicList = [];
    }


    initializeViews() {
        this.setInitialOpportunityLink();

        this.setInitialCosts();

        this.setInitialAddress();

        this.setInitialProductList();

        this.setInitialGenerics();

        //this.setInitialAddDynamics();

        this.setInitialLWCDynamicsList();
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


    handleLogNames(event) {
        try{
            this.lwcDynamicList.forEach(dynamic => {
                console.log( this.view.getAttribute(dynamic.dataIdName, 'value') );
            });
        }catch(err) {
            this.toastHandler.displayError(err.message);
        }
    }

    handleDynamicToggle() {
        if(this.dynamicDC.toggle === false) {
            this.dynamicDC.toggle = true;
        }else {
            this.dynamicDC.toggle = false;
        }

        console.log(this.dynamicDC.toggle);
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


    handleAddDynamic() {
        insertRecord({
            objectName: 'LWC_Dynamic__c',
            
            fieldValuePairs: {
                'Name': this.view.getAttribute('addDynamicName', 'value'),

                'Text__c': this.view.getAttribute('addDynamicText', 'value'),

                'Number__c': Number(this.view.getAttribute('addDynamicNumber', 'value')),

                'LWC_Generic__c': this.lwcGeneric_Id
            }
        }).then(isSuccess => {
            if(!isSuccess) {
                this.toastHandler.displayWarning('Failed to Insert LWC_Dynamic');
            }else {
                this.toastHandler.displaySuccess('LWC_Dynamic Record Inserted');

                this.lwcDynamicList.push({
                    name: this.view.getAttribute('addDynamicName', 'value'),
    
                    text: this.view.getAttribute('addDynamicText', 'value'),
    
                    number: Number(this.view.getAttribute('addDynamicNumber', 'value')),

                    dataIdName: 'dynamicName_' + this.lwcDynamicList.length,

                    dataIdText: 'dynamicText_' + this.lwcDynamicList.length,

                    dataIdNumber: 'dynamicNumber_' + this.lwcDynamicList.length,

                    index: this.lwcDynamicList.length
                });


                this.setInitialAddDynamics();
            }
        }).catch(err => {
            this.toastHandler.displayError( err.body ? err.body.message : err.message );
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

                                this.productList[this.productList.length - 1].dataId = 'product_' + this.productList[this.productList.length - 1]['index'];

                                if(records[recordIndex].Product2.List_Price__c) {
                                    this.productList[this.productList.length - 1].cost = this.currencyFormatter.format(records[recordIndex].Product2.List_Price__c);
                                }else {
                                    this.productList[this.productList.length - 1].cost = this.currencyFormatter.format(0);
                                }


                                if (records[recordIndex].Product2.RecordType.Name === "Chassis" && records[recordIndex].Product2.List_Price__c) {
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


                        this.queryDynamicsFromOpportunity().then(records => {
                            if(records) {
                                if(records.length > 0) {
                                    for(const recordIndex in records) {
                                        this.lwcDynamicList.push({
                                            name: records[recordIndex].Name,
                            
                                            text: records[recordIndex].Text__c,
                            
                                            number: Number(records[recordIndex].Number__c),

                                            dataIdName: 'dynamicName_' + this.lwcDynamicList.length,
                        
                                            dataIdText: 'dynamicText_' + this.lwcDynamicList.length,
                        
                                            dataIdNumber: 'dynamicNumber_' + this.lwcDynamicList.length,
                        
                                            index: this.lwcDynamicList.length
                                        });
                                    }
                                }else {
                                    this.toastHandler.displayInfo('No LWC_Dynamics found for this LWC_Generic');
                                }
                            }
                        }).catch(err => {
                            this.toastHandler.displayError( err.body ? err.body.message : err.message );
                        });
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

    queryDynamicsFromOpportunity() {
        return queryFromString({
            queryString:
                "SELECT Id, Name, Number__c, Text__c" +
                " FROM LWC_Dynamic__c" +
                " WHERE LWC_Generic__c='" +
                    this.lwcGeneric_Id +
                "'"
        });
    }



    renderedCallback() {
        this.view.updateNodes( this.template.querySelectorAll("[data-track='true']") );
    }
}
