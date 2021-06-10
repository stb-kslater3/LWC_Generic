/*
    A standard interface to get data from a given Salesforce Object. Originally made for use by Lightning Web Components in situations where you need to make Imperative calls to Apex rather than through the Wire Service or Lightning Data Service, but accessible anywhere Apex class methods can be called such as other Apex classes themselves.
*/

public with sharing class Apex_Generic_Prototype {
    // Take an arbitrary query string and run that query
    @AuraEnabled(cacheable=false)
    public static sObject[] queryFromString(String queryString) {
      try {
        return Database.query(queryString);
      }catch(Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    // Create an empty object of given objectName Type and give
    // that back to get the defaults
    @AuraEnabled(cacheable=false)
    public static sObject getObjectDefaults(String objectName) {
      try {
        return ((sObject) Type.forName(objectName).newInstance()).getSObjectType().newSObject(null, true);
      }catch(Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    // Given an array of fields, which is a standard argument for passing desired fields on this interface,
    // this will give back a String that can be given to SELECT
    // If no fields, then it returns an empty string
    @TestVisible
    private static String fieldsToSELECT(String[] fields) {
      String selectString = '';
  
      if (fields.size() > 0) {
        // Concatenate each fieldString except the last so that we don't put an extra comma
        for (Integer i = 0; i < fields.size() - 1; i++) {
          selectString += fields[i] + ', ';
        }
  
        selectString += fields[fields.size() - 1];
      }
  
      return selectString;
    }
  
    // Given the name of the Object and the fields that you want, and a max number of fields to retrieve
    // This will give you those records
    @AuraEnabled(cacheable=false)
    public static sObject[] getRecords(
      String objectName,
      String[] fields,
      Integer maxSize
    ) {

      String selectString = fieldsToSELECT(fields);
  
      String queryString =
        'SELECT ' +
        selectString +
        ' FROM ' +
        objectName +
        ' LIMIT ' + maxSize;

      sObject[] records;
  
      try {
        records = Database.query(queryString);
  
        return records;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }

    
    // Given the name of the Object and the fields that you want, and a max number of fields to retrieve
    // This will give you those records, with a where clause
    @AuraEnabled(cacheable=false)
    public static sObject[] getRecordsWhere(
      String objectName,
      String[] fields,
      Map<String, Object> whereValuePairs,
      Integer maxSize
    ) {

      String selectString = fieldsToSELECT(fields);
  
      String whereString = '';

      for(String whereKey : whereValuePairs.keySet()) {
        whereString += whereKey + '=\'' + whereValuePairs.get(whereKey) + '\' ';
      }

      String queryString =
        'SELECT ' +
        selectString +
        ' FROM ' +
        objectName +
        ' WHERE ' +
        whereString +
        ' LIMIT ' + maxSize;

      sObject[] records;
  
      try {
        records = Database.query(queryString);
  
        return records;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }

    
    
    // Given a particular record from a particular object, get the desired other fields from that record
    @AuraEnabled(cacheable=false)
    public static sObject getRecordFromId(
      String objectName,
      Id recordId,
      String[] fields
    ) {

      String selectString = fieldsToSELECT(fields);
  
      String queryString =
        'SELECT ' +
        selectString +
        ' FROM ' +
        objectName +
        ' WHERE Id=\'' +
        recordId +
        '\' LIMIT 1';
 
      sObject record;
      sObject[] records;
  
      try {
        records = Database.query(queryString);
  
        if (records.size() > 0) {
          record = records[0];
        } else {
          record = null;
        }
  
        return record;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    // Given a record's field's values, update these values of that record or create that record if it doesn't exist
    @AuraEnabled(cacheable=false)
    public static Boolean updateRecordFromId(
      String objectName,
      Id recordId,
      Map<String, Object> fieldValuePairs
    ) {
      sObject recordObject;
      Boolean isUpdated = false;

      try {
        recordObject = getRecordFromId(
          objectName,
          recordId,
          new List<String>{ 'Id' }
        );
  
        if (recordObject != null) {
          for (String key : fieldValuePairs.keySet()) {
            if(key.containsIgnoreCase('date')) {
System.debug(fieldValuePairs.get(key));
              // Because inserting a Date runs into problems with Locale
              // do this crazy stuff to determine if I have a Date or a Datetime
              SObjectType r = ((SObject)(Type.forName('Schema.'+objectName).newInstance())).getSObjectType();

              DescribeSObjectResult d = r.getDescribe();
              DisplayType t = d.fields.getMap().get(key).getDescribe().getType();

              if(t == Schema.DisplayType.DATE) {
                Date newDate = Date.parse(String.valueOf(fieldValuePairs.get(key)));
                /* 
                String originalString = (String) fieldValuePairs.get(key);

                originalString = originalString.split('Z')[0];
                originalString = originalString.split('T')[0];
                originalString = originalString.split(' ')[0];

                String[] dateSplit = originalString.split('-');

                String dateString = dateSplit[1];
                dateString += '/' + dateSplit[2];
                dateString += '/' + dateSplit[0];
System.debug(dateString);
                recordObject.put(key, Date.parse(dateString));
                */
                recordObject.put(key, newDate);
              }else {
                Datetime newDateTime = Datetime.parse(String.valueOf(fieldValuePairs.get(key)));

                recordObject.put(key, newDateTime);
              }
            }else {
              recordObject.put(key, fieldValuePairs.get(key));
            }

          }
  
          Database.SaveResult result = Database.update(recordObject, true);
  
          if (result.isSuccess()) {
            isUpdated = true;
          } else {
            isUpdated = false;
          }
        }
  
        return isUpdated;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    // . . . update multiple records
    @AuraEnabled(cacheable=false)
    public static Boolean updateRecords(String objectName, List<Map<String, Object>> records){
      Boolean isUpdated = false;
      List<sObject> recordObjects = new List<sObject>();

      try {
        for(Map<String, Object> fieldValuePairs : records) {
          recordObjects.add( (sObject) Type.forName(objectName).newInstance() );
        
          for (String key : fieldValuePairs.keySet()) {
            if(key.containsIgnoreCase('date')) {
              String originalString = (String) fieldValuePairs.get(key);
              
              originalString = originalString.split('Z')[0];
              originalString = originalString.split('T')[0];
              originalString = originalString.split(' ')[0];

              String[] dateSplit = originalString.split('-');

              String dateString = dateSplit[1];
              dateString += '/' + dateSplit[2];
              dateString += '/' + dateSplit[0];

              recordObjects.get(recordObjects.size() - 1).put(key, Date.parse(dateString));
            }else {
              recordObjects.get(recordObjects.size() - 1).put(key, fieldValuePairs.get(key));
            }
          }
        }

        Database.SaveResult[] results = Database.update(recordObjects, true);
        
        isUpdated = true;
        for(Database.SaveResult result : results) {
          if (!result.isSuccess()) {
            isUpdated = false;
          }
        }

        return isUpdated;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }



    // . . . insert a record
    @AuraEnabled(cacheable=false)
    public static Boolean insertRecord(String objectName, Map<String, Object> fieldValuePairs){
      sObject recordObject;
      Boolean isInserted = false;

      try {
        recordObject = (sObject) Type.forName(objectName).newInstance();
        
        for (String key : fieldValuePairs.keySet()) {
          if(key.containsIgnoreCase('date')) {
System.debug(fieldValuePairs.get(key));
            String originalString = (String) fieldValuePairs.get(key);
            
            originalString = originalString.split('Z')[0];
            originalString = originalString.split('T')[0];
            originalString = originalString.split(' ')[0];

            String[] dateSplit = originalString.split('-');

            String dateString = dateSplit[1];
            dateString += '/' + dateSplit[2];
            dateString += '/' + dateSplit[0];
System.debug(dateString);
            recordObject.put(key, Date.parse(dateString));
          }else {
            recordObject.put(key, fieldValuePairs.get(key));
          }
        }

        Database.SaveResult result = Database.insert(recordObject, true);
        
        if (result.isSuccess()) {
            isInserted = true;
        }

        return isInserted;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    // . . . insert multiple records
    @AuraEnabled(cacheable=false)
    public static Boolean insertRecords(String objectName, List<Map<String, Object>> records){
      Boolean isInserted = false;
      List<sObject> recordObjects = new List<sObject>();

      try {
        for(Map<String, Object> fieldValuePairs : records) {
          recordObjects.add( (sObject) Type.forName(objectName).newInstance() );
        
          for (String key : fieldValuePairs.keySet()) {
            if(key.containsIgnoreCase('date')) {
              String originalString = (String) fieldValuePairs.get(key);
              
              originalString = originalString.split('Z')[0];
              originalString = originalString.split('T')[0];
              originalString = originalString.split(' ')[0];

              String[] dateSplit = originalString.split('-');

              String dateString = dateSplit[1];
              dateString += '/' + dateSplit[2];
              dateString += '/' + dateSplit[0];

              recordObjects.get(recordObjects.size() - 1).put(key, Date.parse(dateString));
            }else {
              recordObjects.get(recordObjects.size() - 1).put(key, fieldValuePairs.get(key));
            }
          }
        }

        Database.SaveResult[] results = Database.insert(recordObjects, true);
        
        isInserted = true;
        for(Database.SaveResult result : results) {
          if (!result.isSuccess()) {
            isInserted = false;
          }
        }

        return isInserted;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }


    @AuraEnabled(cacheable=false)
    public static Boolean deleteRecords(String objectName, Id[] toDelete) {
      Boolean areDeleted = true;
      List<sObject> recordObjects = new List<sObject>();

      try {
        for(Id recId : toDelete) {
          recordObjects.add( (sObject) Type.forName(objectName).newInstance() );

          recordObjects.get(recordObjects.size() - 1).put('Id', recId);
        }

        Database.DeleteResult[] results = Database.delete(recordObjects, true);

        for(Database.DeleteResult result : results) {
          if (!result.isSuccess()) {
            areDeleted = false;
          }
        }
        
        return areDeleted;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  }
