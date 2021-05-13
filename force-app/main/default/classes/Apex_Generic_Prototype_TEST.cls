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
}

