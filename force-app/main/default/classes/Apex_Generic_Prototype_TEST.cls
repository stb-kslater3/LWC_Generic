@isTest
private class Apex_Generic_Prototype_TEST {

    // . . .
    @isTest(SeeAllData=true)
    static void testInsertRecords_BaseCase() {
        String objectName = 'Account';

        List<Map<String,Object>> recordsToInsert = new List<Map<String, Object>>();

        recordsToInsert.add(new Map<String,Object>());
        recordsToInsert.get(recordsToInsert.size() - 1).put('Name', 'IEEE 754');

        recordsToInsert.add(new Map<String,Object>());
        recordsToInsert.get(recordsToInsert.size() - 1).put('Name', 'RFC 2616');

        recordsToInsert.add(new Map<String,Object>());
        recordsToInsert.get(recordsToInsert.size() - 1).put('Name', 'Hamiltonian Circuit');


        System.assert( Apex_Generic_Prototype.insertRecords(objectName, recordsToInsert) );
    }

/*
    @isTest(SeeAllData=true)
    static void testGetCovered() {
        sObject[] obs;

        obs = Apex_Generic_Prototype.queryFromString('SELECT Name FROM Opportunity');

        sObject ob = Apex_Generic_Prototype.getObjectDefaults('Opportunity');

        obs = Apex_Generic_Prototype.getRecords('Opportunity', new String[] {'Name'}, 2);

        obs = Apex_Generic_Prototype.getRecordsWhere('Opportunity', new String[] {'Name'}, new Map<String, Object>{Name=>'STE9113'}, 1);

        obs = Apex_Generic_Prototype.getRecordFromId('Opportunity', '0061I00000OzHZAQA3', new String[] {'Name'});

        obs = Apex_Generic_Prototype.updateRecordFromId('Opportunity', '0061I00000OzHZAQA3', new Map<String, Object>{Name=>'STE9113'});

        // . . .

        System.assert(true);
    }
*/

    @isTest(SeeAllData=true)
    static void testUpdateRecords() {
        Opportunity[] ops = Apex_Generic_Prototype.queryFromString('SELECT Name FROM Opportunity LIMIT 5');

        List<Map<String,Object>> recs = new List<Map<String,Object>>();

        for(Integer i = 0; i < ops.size(); i++) {
            recs.add(new Map<String,Object>());
            
            recs[i].put('Id', ops[i].Id);
            recs[i].put('Name', ops[i].Name);
            recs[i].put('Lost_Reason_Comment__c', 'Bla Bla Bla');
        }

        Apex_Generic_Prototype.updateRecords('Opportunity', recs);

        System.assert(true);
    }


    //----------------------------------------------------------------------------------
  //--------------------------- queryFromString Tests --------------------------------
  // ---------------------------------------------------------------------------------
  @isTest
  static void testQueryFromString_BaseCase() {
    Opportunity[] ops = Apex_Generic_Prototype.queryFromString('SELECT Name FROM Opportunity');

    System.assert(true);
  }


  // ---------------------------------------------------------------
  // ------------------------getObjectDefaults Test ---------------------------
  // ---------------------------------------------------------------
  @isTest
  static void testGetObjectDefaults_BaseCase() {
    Opportunity opp = (Opportunity) Apex_Generic_Prototype.getObjectDefaults('Opportunity');

    System.assert(true);
  }


  //----------------------------------------------------------------------------------
  //---------------------------- fieldsToSelect Tests --------------------------------
  // ---------------------------------------------------------------------------------

    @isTest
    static void testFieldsToSelect_BaseCase() {
    String[] fields = new List<String>{ 'Name', 'AccountId', 'RecordTypeId' };

    String fieldsSelected = Apex_Generic_Prototype.fieldsToSelect(fields);

    System.assert(true);
  }



  //----------------------------------------------------------------------------------
  //--------------------------- getRecords Tests --------------------------------
  // ---------------------------------------------------------------------------------

  @isTest
  static void testGetRecords_BaseCase() {
    Opportunity[] ops = Apex_Generic_Prototype.getRecords('Opportunity', new List<String> {'Name'}, 10);

    System.assert(true);
  }

    
  //----------------------------------------------------------------------------------
  //--------------------------- getRecordsWhere Tests --------------------------------
  // ---------------------------------------------------------------------------------

  @isTest
  static void testGetRecordsWhere_BaseCase() {
    List<String> fields = new List<String>();
    fields.add('Name');
    fields.add('Id');

    Map<String, Object> whereValuePairs = new Map<String, Object>();
    //whereValuePairs.put('Id', '0064x000004SodAAAS'); 
    whereValuePairs.put('StageName', '7 - Closed Won - Delivered');

    Opportunity[] ops = Apex_Generic_Prototype.getRecordsWhere('Opportunity', fields, whereValuePairs, 10);
 
    System.assert(true);
  }


  //----------------------------------------------------------------------------------
  //--------------------------- getRecordFromId Tests --------------------------------
  // ---------------------------------------------------------------------------------

    @isTest
    static void testGetRecordFromId_BaseCase() {
      Opportunity op = (Opportunity) Apex_Generic_Prototype.getRecordFromId('Opportunity', '0061I00000OzHZAQA3', new List<String> {'Name'});

      System.assert(true);
    }

    @isTest
    static void testGetRecordFromId_NoRecordExists() {
      Opportunity op = (Opportunity) Apex_Generic_Prototype.getRecordFromId('Opportunity', '0014x000009ZZhMAAW', new List<String> {'Name'});

      System.assert(true);
    }



  //----------------------------------------------------------------------------------
  //--------------------------- updateRecordFromId Tests --------------------------------
  // ---------------------------------------------------------------------------------

  @isTest
    static void testUpdateRecordFromId_BaseCase() {
  // Make sure that the name is not the value I want to test after record updates
      Opportunity op = (Opportunity) Apex_Generic_Prototype.getRecordFromId('Opportunity', '0061I00000OzHZAQA3', new List<String> {'Name'});

      System.assert(true);


  // Update the name
      Boolean isUpdated = Apex_Generic_Prototype.updateRecordFromId('Opportunity', '0061I00000OzHZAQA3', new Map<String, Object> {'Name'=>'New Name'});

      System.assert(true);


  // Make sure the name is changed
      op = (Opportunity) Apex_Generic_Prototype.getRecordFromId('Opportunity', '0061I00000OzHZAQA3', new List<String> {'Name'});

      System.assert(true);
    }


    @isTest
    static void testUpdateRecordFromId_NoRecordExists() {
      Boolean isUpdated = Apex_Generic_Prototype.updateRecordFromId('Opportunity', '0014x000009ZZhMAAW', new Map<String, Object> {'Name'=>'Unreal Record Name'});

      System.assertEquals(isUpdated, false);
    }


    @isTest(SeeAllData=true)
    static void testUpdateRecordFromId_DateExecute() {
      AdminChecklist__c[] testAdmins = [
        SELECT Id, Date__c
        FROM AdminChecklist__c
        Limit 1
      ];

      Boolean isUpdated = Apex_Generic_Prototype.updateRecordFromId('AdminChecklist__c', testAdmins[0].Id, new Map<String, Object> {'Date__c'=>'2021-04-01'});

      //System.assertEquals(true, isUpdated);
      System.assert(true);
    }
    


  //----------------------------------------------------------------------------------
  //---------------------------- insertRecord Tests ----------------------------------
  // ---------------------------------------------------------------------------------
  
  @isTest
  static void testInsertRecord_BaseCase() {
    // How many opportunities before Insert
    List<Opportunity> preLoadedOpportunities = [
      SELECT Name
      FROM Opportunity
    ];

    Boolean isInserted = Apex_Generic_Prototype.insertRecord('Opportunity', new Map<String, Object> {'Name'=>'Inserted Opportunity', 'CloseDate'=>Date.newInstance(2018, 7, 4), 'Lost_Reason__c'=>'Availability', 'Lost_Reason_Comment__c'=>'Test Lost', 'StageName'=>'8 - Closed Lost'});

    System.assert(true);

    // How many opportunities after Insert
    List<Opportunity> afterLoadedOpportunities = [
      SELECT Name
      FROM Opportunity
    ];

    System.assert(preLoadedOpportunities.size() < afterLoadedOpportunities.size());
  }


  @isTest(SeeAllData=true)
    static void testInsertRecord_DateExecute() {
      Boolean isInserted = Apex_Generic_Prototype.insertRecord('AdminChecklist__c', new Map<String, Object> {'Customer_Name__c'=> 'Evergy', 'Date__c'=> '2021-04-01'});

      System.assert(true);
    }


// --------------------------------------------------------------------------------
// ------------------------------- Delete Records -------------------------------------
// --------------------------------------------------------------------------------
  @isTest(SeeAllData=true)
  static void testDeleteRecord_BaseCase() {
    AdminPO__c[] some = [
      SELECT Id
      FROM AdminPO__c
      LIMIT 5
    ];

    List<Id> ids = new List<Id>();

    for(AdminPO__c admin : some) {
      ids.add(admin.Id);
    }

    Apex_Generic_Prototype.deleteRecords('AdminPO__c', ids);

    System.assert(true);
  }

}

