var sheet = SpreadsheetApp.getActive();


var accountId = sheet.getRangeByName("ga_account").getValues()[0][0];
var propertyId = sheet.getRangeByName("ga_property").getValues()[0][0];
var viewId = sheet.getRangeByName("ga_profile").getValues()[0][0];
var gtmAccountId = sheet.getRangeByName("gtm_account").getValues()[0][0];

var gtmContainerObj = fetchContainers();
var gtmContainerId = gtmContainerObj.containerId;


function getGoals() {

  var goalList = [];
  var goals =  Analytics.Management.Goals.list(accountId, propertyId, viewId).items;

  if (goals !== null) {
    for (var j = 0; j < goals.length; j++) {
      Logger.log(JSON.stringify(goals[j]));

      var currentGoal = goals[j];
      var type = currentGoal.type;
      var tempArray = [
        accountId,
        propertyId,
        viewId,
        currentGoal.name,
        currentGoal.id,
        currentGoal.active,
        type
      ];
      if (type == 'URL_DESTINATION') {
        var destinationArray = [currentGoal.urlDestinationDetails.matchType,
                                currentGoal.urlDestinationDetails.url,
                                currentGoal.urlDestinationDetails.caseSensitive,
                                '','','','','','','','','','',''];
        tempArray = tempArray.concat(destinationArray);
      } else if (type == 'EVENT') {
        var eventArray = ['', '', '', '',
                          '', '', '', '','',currentGoal.eventDetails.useEventValue, '', '', '', ''];
        for (var k = 0; k < currentGoal.eventDetails.eventConditions.length; k++) {
          if (currentGoal.eventDetails.eventConditions[k].type == 'CATEGORY') {
            eventArray[3] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[4] = currentGoal.eventDetails.eventConditions[k].expression;
          } else if (currentGoal.eventDetails.eventConditions[k].type == 'ACTION') {
            eventArray[5] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[6] = currentGoal.eventDetails.eventConditions[k].expression;
          } else if (currentGoal.eventDetails.eventConditions[k].type == 'LABEL') {
            eventArray[7] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[8] = currentGoal.eventDetails.eventConditions[k].expression;
          }
        }
        tempArray = tempArray.concat(eventArray);
      } else if (type == 'VISIT_TIME_ON_SITE') {
        var timeOnSite = ['','','','','','', '', '', '','',
                          currentGoal.visitTimeOnSiteDetails.comparisonType,
                          currentGoal.visitTimeOnSiteDetails.comparisonValue,
                          '',''];
        tempArray = tempArray.concat(timeOnSite);
      } else if (type == 'VISIT_NUM_PAGES') {
        var numOfPages = ['','','','','','', '', '','','','','',
                          currentGoal.visitNumPagesDetails.comparisonType,
                          currentGoal.visitNumPagesDetails.comparisonValue];
        tempArray = tempArray.concat(numOfPages);
      }
      tempArray.push(currentGoal.value);
      goalList.push(tempArray);
    }
  }


 
  let saheet = sheet.getSheetByName('UA Goals');

  if (saheet == undefined) {
    saheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('UA Goals');
  }

  if (goalList.length > 0) {
    saheet.getRange(2, 1, goalList.length, 22).setValues(goalList);
  }



}




function getFilters() {

var filterHeaders = [['id','kind','selfLink','accountId','name','type','created','updated','parentLink.type','parentLink.href','includeDetails.caseSensitive','includeDetails.expressionValue','includeDetails.field','includeDetails.fieldIndex','includeDetails.kind','includeDetails.matchType','excludeDetails.caseSensitive','excludeDetails.expressionValue','excludeDetails.field','excludeDetails.fieldIndex','excludeDetails.kind','excludeDetails.matchType','searchAndReplaceDetails.caseSensitive','searchAndReplaceDetails.field','searchAndReplaceDetails.replaceString','searchAndReplaceDetails.searchString','lowercaseDetails.field','advancedDetails.caseSensitive','advancedDetails.extractA','advancedDetails.extractB','advancedDetails.fieldA','advancedDetails.fieldARequired','advancedDetails.fieldB','advancedDetails.fieldBRequired','advancedDetails.outputConstructor','advancedDetails.outputToField','advancedDetails.overrideOutputField']]



  var filterList = [];
  var filters =  Analytics.Management.Filters.list(accountId).items;


var filterVals = [];
  if (filters !== null) {
    for (var j = 0; j < filters.length; j++) {

filterVals[j] = []


filterVals[j][0] = filters[j].id ? filters[j].id : '';
filterVals[j][1] = filters[j].kind ? filters[j].kind : '';
filterVals[j][2] = filters[j].selfLink ? filters[j].selfLink : '';
filterVals[j][3] = filters[j].accountId ? filters[j].accountId : '';
filterVals[j][4] = filters[j].name ? filters[j].name : '';
filterVals[j][5] = filters[j].type ? filters[j].type : '';
filterVals[j][6] = filters[j].created ? filters[j].created : '';
filterVals[j][7] = filters[j].updated ? filters[j].updated : '';
filterVals[j][8] = filters[j].parentLink.type ? filters[j].parentLink.type : '';
filterVals[j][9] = filters[j].parentLink.href ? filters[j].parentLink.href : '';

if("includeDetails" in filters[j] ){
filterVals[j][10] = filters[j].includeDetails.caseSensitive ? filters[j].includeDetails.caseSensitive : '';
filterVals[j][11] = filters[j].includeDetails.expressionValue ? filters[j].includeDetails.expressionValue : '';
filterVals[j][12] = filters[j].includeDetails.field ? filters[j].includeDetails.field : '';
filterVals[j][13] = filters[j].includeDetails.fieldIndex ? filters[j].includeDetails.fieldIndex : '';
filterVals[j][14] = filters[j].includeDetails.kind ? filters[j].includeDetails.kind : '';
filterVals[j][15] = filters[j].includeDetails.matchType ? filters[j].includeDetails.matchType : '';
}else{
filterVals[j][10] = '';
filterVals[j][11] = '';
filterVals[j][12] = '';
filterVals[j][13] = '';
filterVals[j][14] = '';
filterVals[j][15] = '';

}


if("excludeDetails" in filters[j]){

filterVals[j][16] = filters[j].excludeDetails.caseSensitive ? filters[j].excludeDetails.caseSensitive : '';
filterVals[j][17] = filters[j].excludeDetails.expressionValue ? filters[j].excludeDetails.expressionValue : '';
filterVals[j][18] = filters[j].excludeDetails.field ? filters[j].excludeDetails.field : '';
filterVals[j][19] = filters[j].excludeDetails.fieldIndex ? filters[j].excludeDetails.fieldIndex : '';
filterVals[j][20] = filters[j].excludeDetails.kind ? filters[j].excludeDetails.kind : '';
filterVals[j][21] = filters[j].excludeDetails.matchType ? filters[j].excludeDetails.matchType : '';
}else{

filterVals[j][16] = '';
filterVals[j][17] = '';
filterVals[j][18] = '';
filterVals[j][19] = '';
filterVals[j][20] = '';
filterVals[j][21] = '';
}

if("searchAndReplaceDetails" in filters[j]){
Logger.log(JSON.stringify(filters[j]));

filterVals[j][22] = filters[j].searchAndReplaceDetails.caseSensitive ? filters[j].searchAndReplaceDetails.caseSensitive : '';
filterVals[j][23] = filters[j].searchAndReplaceDetails.field ? filters[j].searchAndReplaceDetails.field : '';
filterVals[j][24] = filters[j].searchAndReplaceDetails.replaceString ? filters[j].searchAndReplaceDetails.replaceString : '';
filterVals[j][25] = filters[j].searchAndReplaceDetails.searchString ? filters[j].searchAndReplaceDetails.searchString : '';

}else{
filterVals[j][22] = '';
filterVals[j][23] = '';
filterVals[j][24] = '';
filterVals[j][25] = '';

}

if("lowercaseDetails" in filters[j]){
filterVals[j][26] = filters[j].lowercaseDetails.field ? filters[j].lowercaseDetails.field : '';
}else{

filterVals[j][26] = '';
}

if("advancedDetails" in filters[j]){
filterVals[j][27] = filters[j].advancedDetails.caseSensitive ? filters[j].advancedDetails.caseSensitive : '';
filterVals[j][28] = filters[j].advancedDetails.extractA ? filters[j].advancedDetails.extractA : '';
filterVals[j][29] = filters[j].advancedDetails.extractB ? filters[j].advancedDetails.extractB : '';
filterVals[j][30] = filters[j].advancedDetails.fieldA ? filters[j].advancedDetails.fieldA : '';
filterVals[j][31] = filters[j].advancedDetails.fieldARequired ? filters[j].advancedDetails.fieldARequired : '';
filterVals[j][32] = filters[j].advancedDetails.fieldB ? filters[j].advancedDetails.fieldB : '';
filterVals[j][33] = filters[j].advancedDetails.fieldBRequired ? filters[j].advancedDetails.fieldBRequired : '';
filterVals[j][34] = filters[j].advancedDetails.outputConstructor ? filters[j].advancedDetails.outputConstructor : '';
filterVals[j][35] = filters[j].advancedDetails.outputToField ? filters[j].advancedDetails.outputToField : '';
filterVals[j][36] = filters[j].advancedDetails.overrideOutputField ? filters[j].advancedDetails.overrideOutputField : '';
}else{

filterVals[j][27] = '';
filterVals[j][28] = '';
filterVals[j][29] = '';
filterVals[j][30] = '';
filterVals[j][31] = '';
filterVals[j][32] = '';
filterVals[j][33] = '';
filterVals[j][34] = '';
filterVals[j][35] = '';
filterVals[j][36] = '';

}



      
      
      filterList.push(filterVals[j])
    
    }


    //Logger.log(filterList);

  }


  let saheet = sheet.getSheetByName('UA Filters');

  if (saheet == undefined) {
    saheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('UA Filters');
  }

  if (filterList.length > 0) {
    
    //getRange(start row, start column, number of rows, number of columns)


//Logger.log(saheet.getRange(1, 1, 1, 37).getValues())

    saheet.getRange(1, 1, 1, 37).setValues(filterHeaders);

    saheet.getRange(2, 1, filterList.length, 37).setValues(filterList);
  }



}




function getCustomDimensions() {


var cdHeaders = [['accountId','active','created','id','index','kind','name','parentLink.href','parentLink.type','scope','selfLink','updated','webPropertyId']];

  var cdList = [];
  var cds =  Analytics.Management.CustomDimensions.list(accountId, propertyId).items;


var cdVals = [];
  if (cds !== null) {
    for (var j = 0; j < cds.length; j++) {

cdVals[j] = []

cdVals[j][0]= cds[j].accountId ? cds[j].accountId : '';
cdVals[j][1]= cds[j].active ? cds[j].active : '';
cdVals[j][2]= cds[j].created ? cds[j].created : '';
cdVals[j][3]= cds[j].id ? cds[j].id : '';
cdVals[j][4]= cds[j].index ? cds[j].index : '';
cdVals[j][5]= cds[j].kind ? cds[j].kind : '';
cdVals[j][6]= cds[j].name ? cds[j].name : '';




if("parentLink" in cds[j]){
  Logger.log(cds[j])

cdVals[j][7]= cds[j].parentLink.href ? cds[j].parentLink.href : '';
cdVals[j][8]= cds[j].parentLink.type ? cds[j].parentLink.type : '';

}else{

cdVals[j][7] = '';
cdVals[j][8] = '';
}



cdVals[j][9]= cds[j].scope ? cds[j].scope : '';
cdVals[j][10]= cds[j].selfLink ? cds[j].selfLink : '';
cdVals[j][11]= cds[j].updated ? cds[j].updated : '';
cdVals[j][12]= cds[j].webPropertyId ? cds[j].webPropertyId : '';

    
      cdList.push(cdVals[j])

    }
    
  }



  let saheet = sheet.getSheetByName('UA Custom Dimensions');

  if (saheet == undefined) {
    saheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('UA Custom Dimensions');
  }

  if (cdList.length > 0) {
  
  Logger.log(cdList);
  Logger.log(cdList.length);

  Logger.log(saheet.getRange(2, 1, 2, 13).getValues())
    saheet.getRange(1, 1, 1, 13).setValues(cdHeaders);

    saheet.getRange(2, 1, cdList.length, 13).setValues(cdList);
  }


}


function getViews() {


var viewHeaders = [['accountId','botFilteringEnabled','childLink.href','childLink.type','created','currency','eCommerceTracking','enhancedECommerceTracking','excludeQueryParameters','id','internalWebPropertyId','kind','name','parentLink.href','parentLink.type','permissions.effective','selfLink','siteSearchQueryParameters','stripSiteSearchQueryParameters','timezone','type','updated','webPropertyId','websiteUrl']];

  var viewList = [];
  var views =  Analytics.Management.Profiles.list(accountId, propertyId).items;


var viewVals = [];
  if (views !== null) {
    for (var j = 0; j < views.length; j++) {

viewVals[j] = []

viewVals[j][0]= views[j].accountId ? views[j].accountId : '';
viewVals[j][1]= views[j].botFilteringEnabled ? views[j].botFilteringEnabled : '';


if("childLink" in views[j]){
viewVals[j][2]= views[j].childLink.href ? views[j].childLink.href : '';
viewVals[j][3]= views[j].childLink.type ? views[j].childLink.type : '';
}else{
viewVals[j][2]=  '';
viewVals[j][3]=  '';
}

viewVals[j][4]= views[j].created ? views[j].created : '';
viewVals[j][5]= views[j].currency ? views[j].currency : '';
viewVals[j][6]= views[j].eCommerceTracking ? views[j].eCommerceTracking : '';
viewVals[j][7]= views[j].enhancedECommerceTracking ? views[j].enhancedECommerceTracking : '';
viewVals[j][8]= views[j].excludeQueryParameters ? views[j].excludeQueryParameters : '';
viewVals[j][9]= views[j].id ? views[j].id : '';
viewVals[j][10]= views[j].internalWebPropertyId ? views[j].internalWebPropertyId : '';
viewVals[j][11]= views[j].kind ? views[j].kind : '';
viewVals[j][12]= views[j].name ? views[j].name : '';

if("parentLink" in views[j]){

viewVals[j][13]= views[j].parentLink.href ? views[j].parentLink.href : '';
viewVals[j][14]= views[j].parentLink.type ? views[j].parentLink.type : '';
}else{
viewVals[j][13]= '';
viewVals[j][14]= '';
}


if("permissions" in views[j]){
viewVals[j][15]= views[j].permissions ? views[j].permissions.effective.join(", ") : '';

}else{
viewVals[j][15]= '';

}

viewVals[j][16]= views[j].selfLink ? views[j].selfLink : '';
viewVals[j][17]= views[j].siteSearchQueryParameters ? views[j].siteSearchQueryParameters : '';
viewVals[j][18]= views[j].stripSiteSearchQueryParameters ? views[j].stripSiteSearchQueryParameters : '';
viewVals[j][19]= views[j].timezone ? views[j].timezone : '';
viewVals[j][20]= views[j].type ? views[j].type : '';
viewVals[j][21]= views[j].updated ? views[j].updated : '';
viewVals[j][22]= views[j].webPropertyId ? views[j].webPropertyId : '';
viewVals[j][23]= views[j].websiteUrl ? views[j].websiteUrl : '';







    
      viewList.push(viewVals[j])

    }
    
  }



  let saheet = sheet.getSheetByName('UA View');

  if (saheet == undefined) {
    saheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('UA View');
  }

  if (viewList.length > 0) {
  
  Logger.log(viewList);
  Logger.log(viewList.length);

  Logger.log(saheet.getRange(2, 1, 2, 24).getValues())
    saheet.getRange(1, 1, 1, 24).setValues(viewHeaders);

    saheet.getRange(2, 1, viewList.length, 24).setValues(viewList);
  }

}



//Tag name	Tag ID	Tag type	Folder ID	Last modified	Firing trigger IDs	Exception trigger IDs	Setup tag	Cleanup tag	Notes	JSON (do NOT edit!)	Event tag	Event name	All triggers	Event Category	Event Action	Event Label	Event Value	Non-Interaction	# Triggers


function buildTagsSheet(){

//function fetchLatestVersionId(gtmAccountId, gtmContainerId)
  var lvidparent = 'accounts/' + gtmAccountId + '/containers/' + gtmContainerId;
  Logger.log(lvidparent);


  var latestVersionId = TagManager.Accounts.Containers.Version_headers.latest(lvidparent, {
    fields: 'containerVersionId'
  }).containerVersionId;

  
  if (latestVersionId === '0') { throw new Error('You need to create or publish a version in the container before you can build its documentaiton!'); }

//function fetchLatestVersion(gtmAccountId, gtmContainerId, latestVersionId)
  var lvparent = 'accounts/' + gtmAccountId + '/containers/' + gtmContainerId + '/versions/' + latestVersionId;
  var latestVersion = TagManager.Accounts.Containers.Versions.get(lvparent);
  
  var containerObj = {
    accountId: latestVersion.container.accountId,
    containerId: latestVersion.container.containerId,
    containerName: latestVersion.container.name,
    containerPublicId: latestVersion.container.publicId,
    containerNotes: latestVersion.container.notes || '',
    containerLink: latestVersion.container.tagManagerUrl,
    versionName: latestVersion.name || '',
    versionId: latestVersion.containerVersionId,
    versionDescription: latestVersion.description || '',
    versionCreatedOrPublished: new Date(parseInt(latestVersion.fingerprint)),
    tags: latestVersion.tag || [],
    variables: latestVersion.variable || [],
    triggers: latestVersion.trigger || [],
    folders: latestVersion.folder || []
  };
  

  
  var sheetName = containerObj.containerPublicId + '_tags';
  var sheet = insertSheet(sheetName);
  
  if (sheet === false) { return; }
  
  sheet.clear();
  
  var tagLabels = ['Tag name', 'Tag ID', 'Tag type', 'Folder ID', 'Last modified', 'Firing trigger IDs', 'Exception trigger IDs', 'Setup tag', 'Cleanup tag', 'Notes', 'JSON (do NOT edit!)','Event tag','Event name','All triggers','Event Category','Event Action','Event Label','Non-Interaction','# triggers','triggers'];

  createHeaders(sheet, tagLabels, 'Tags for container ' + containerObj.containerPublicId + ' (' + containerObj.containerName + ').');

  sheet.setColumnWidth(1, 305);
  sheet.setColumnWidth(2, 75);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 75);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 150);
  sheet.setColumnWidth(8, 205);
  sheet.setColumnWidth(9, 205);
  sheet.setColumnWidth(10, 305);
  sheet.setColumnWidth(11, 130);


  var formattedTagList = getFormattedTags(containerObj.tags);


  var formattedTriggerList = getFormattedTriggers(containerObj.triggers);
  

  var tagsObject = formatTags(containerObj.tags,formattedTagList, formattedTriggerList);



  if (tagsObject.length) {
  
    var dataRange = sheet.getRange(3,1,tagsObject.length,tagLabels.length);
    dataRange.setValues(tagsObject);
    dataRange.setBackground('#fff');

    var rangeName = 'tags_' + containerObj.accountId + '_' + containerObj.containerId;
    setNamedRanges(sheet,rangeName,tagLabels.indexOf('Notes') + 1,tagLabels.indexOf('JSON (do NOT edit!)') + 1,tagsObject.length);
  
    var formats = tagsObject.map(function(a) {
      return ['@', '@', '@', '@', 'dd/mm/yy at h:mm', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@'];
    });
    
    dataRange.setNumberFormats(formats);
    dataRange.setHorizontalAlignment('left');
  }

}


function formatTags(tags,ftags, triggs) {

    var data = [];
    tags.forEach(function(tag) {
      var triggerString = "";
      var ftt = tag.firingTriggerId ? tag.firingTriggerId : []
        Logger.log('ftt')
      if(ftt.length > 0){

        ftt.forEach(function(ft){
        
          if(typeof ft !== 'undefined' && triggs.hasOwnProperty(ft) ){
        Logger.log('triggs[ft]')
        Logger.log(triggs[ft].name)
        Logger.log('triggs[ft]')
        var tstr = triggs[ft].name ? triggs[ft].name : 'na'
        triggerString += tstr + "\n";


          }
        })
        Logger.log('triggerString')
        Logger.log(triggerString)
      }

      data.push([
        tag.name,
        tag.tagId,
        tag.type,
        tag.parentFolderId || '',
        new Date(parseInt(tag.fingerprint)),
        tag.firingTriggerId ? tag.firingTriggerId.join(',') : '',
        tag.blockingTriggerId ? tag.blockingTriggerId.join(',') : '',
        tag.setupTag ? tag.setupTag[0].tagName : '',
        tag.teardownTag ? tag.teardownTag[0].tagName : '',
        tag.notes || '',
        JSON.stringify(tag),
        tag.type === 'ua' ? tag.parameter.filter( prm=>{return prm.key === "trackType"})[0].value : 'n/a',
        tag.name,
        triggerString,
        ftags[tag.tagId].parameter.eventAction,
        ftags[tag.tagId].parameter.eventAction,
        ftags[tag.tagId].parameter.eventLabel,
        ftags[tag.tagId].parameter.nonInteraction,
        ftt.length,
        tag.firingTriggerId ? tag.firingTriggerId.join(',') : '',


      ]);
    });
    return data;
  }
 
 function setNamedRanges(sheet,rangeName,notesIndex,jsonIndex,colLength) {
  var notesRange = sheet.getRange(3,notesIndex,colLength,1);
  var notesRangeName = rangeName + '_notes';
  SpreadsheetApp.getActiveSpreadsheet().setNamedRange(notesRangeName, SpreadsheetApp.getActiveSpreadsheet().getRange(sheet.getName() + '!' + notesRange.getA1Notation()));
  var jsonRange = sheet.getRange(3,jsonIndex,colLength,1);
  var jsonRangeName = rangeName + '_json';
  SpreadsheetApp.getActiveSpreadsheet().setNamedRange(jsonRangeName, SpreadsheetApp.getActiveSpreadsheet().getRange(sheet.getName() + '!' + jsonRange.getA1Notation()));
  
  var ranges = JSON.parse(PropertiesService.getUserProperties().getProperty('named_ranges')) || {};
  ranges[notesRangeName] = true;
  ranges[jsonRangeName] = true;
  PropertiesService.getUserProperties().setProperty('named_ranges', JSON.stringify(ranges));
}

function createHeaders(sheet, labels, title) {
  var headerRange = sheet.getRange(1,1,1,labels.length);
  headerRange.mergeAcross();
  headerRange.setValue(title);
  headerRange.setBackground('#1155cc');
  headerRange.setFontWeight('bold');
  headerRange.setFontColor('white');
  
  var labelsRange = sheet.getRange(2,1,1,labels.length);
  labelsRange.setValues([labels]);
  labelsRange.setFontWeight('bold');
}


function fetchAccounts() {
  var accounts = TagManager.Accounts.list().account;
  Logger.log(accounts)
  // return accounts || [];
}

function fetchContainers() {
  var parent = 'accounts/' + gtmAccountId;
  var containers = TagManager.Accounts.Containers.list(parent).container;
  //Logger.log(containers[0].containerId)

 return containers[0] || [];
}

function insertSheet(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var ui = SpreadsheetApp.getUi();
  var response;
  if (sheet) {
    return sheet;
  }
  return SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
}



function getFormattedTriggers(triggerObj){

var sortedBatches = [];
var triggerArray = [];
var newTriggerArray = [];
var i=0;


triggerObj.forEach(function(thisTrigger) {


var trigid = thisTrigger.triggerId


triggerArray[trigid] = {};

triggerArray[trigid].name = thisTrigger.name;
triggerArray[trigid].type = thisTrigger.type;

sortedBatches[trigid] ='';


//Print Event if Present


if(thisTrigger.customEventFilter){

thisTrigger.customEventFilter.forEach(function(customEventFilter) {



// Logger.log('customEventFilter')
// Logger.log(customEventFilter)

		var negate = '';
		var caseSensitive = '';
		var isnot = '';
		
		
	if(typeof customEventFilter.parameter[2] !== 'undefined'){
	
		if(customEventFilter.parameter[2].key === 'ignore_case' && customEventFilter.parameter[2].value === 'false'){
			caseSensitive = ':case_sensitive';
		}	
		if(customEventFilter.parameter[2].key === 'negate' && customEventFilter.parameter[2].value === 'true'){
			negate = ':negate';
			isnot = ':!not!:';
		}
	}
	
	if(typeof customEventFilter.parameter[3] !== 'undefined'){
		if(customEventFilter.parameter[3].key === 'ignore_case' && customEventFilter.parameter[3].value === 'false'){
			caseSensitive = ':case_sensitive';
		}
		 if(customEventFilter.parameter[3].key === 'negate' && customEventFilter.parameter[3].value === 'true'){
			negate = ':negate';
			isnot = ':!not!:';

		}
	}

	sortedBatches[trigid] +=`${customEventFilter.parameter[0].value} ${caseSensitive}[${isnot}${customEventFilter.type}]= '#` +  customEventFilter.parameter[1].value.replace(/\"/,  '{qt}') + `#'${caseSensitive} {&&} `;


	});

	
}



//Print Filters
if(thisTrigger.filter){

thisTrigger.filter.forEach(function(triggerFilter) {


		var negate = '';
		var caseSensitive = '';
		var isnot = '';
	

		if(typeof triggerFilter.parameter[2] !== 'undefined'){
		
			if(triggerFilter.parameter[2].key === 'ignore_case' && triggerFilter.parameter[2].value === 'false'){
				caseSensitive = ':case_sensitive';
			}
			if(triggerFilter.parameter[2].key === 'negate'      && triggerFilter.parameter[2].value === 'true'){
				negate = ':negate';
				isnot = '!';
			}
		}
	
		if(typeof triggerFilter.parameter[3] !== 'undefined'){
			if(triggerFilter.parameter[3].key === 'ignore_case' && triggerFilter.parameter[3].value === 'false'){
				caseSensitive = ':case_sensitive';
			}
			if(triggerFilter.parameter[3].key === 'negate'      && triggerFilter.parameter[3].value === 'true'){
				negate = ':negate';
				isnot = '!';
			}
		}
	
	
	if(typeof triggerFilter.parameter[0] !== 'undefined'){


		sortedBatches[trigid] += `${triggerFilter.parameter[0].value} ${caseSensitive}[${isnot}${triggerFilter.type}]= '` + triggerFilter.parameter[1].value.replace(/\"/,  '{qt}') + `'${caseSensitive} {&&} `;


}else{
	//console.log(triggerFilter);
	
}


});


}


newTriggerArray[trigid] = {};

newTriggerArray[trigid].id = trigid;
newTriggerArray[trigid].name = thisTrigger.name;
newTriggerArray[trigid].type = thisTrigger.type;



var concPatts = '';



concPatts += sortedBatches[trigid];

newTriggerArray[trigid].filters =  concPatts.replace(/ \{&&} $/,'')




// working trigger
if(  thisTrigger.filter || thisTrigger.customEventFilter ){
	triggerArray[trigid].filter = newTriggerArray[trigid].filters;

}else{
	var triggerParms = [];

	for(var tpar in thisTrigger.parameter){
	
		if(thisTrigger.type === 'TRIGGER_GROUP'){
			var groupOfTriggers = [];
		
			for(var tpl in tpar.list){
				groupOfTriggers.push(tpl.value);
			}

		}
		
		triggerParms[tpar.key] = tpar.value;

	}
	

	triggerArray[trigid].filter ="na~ " + thisTrigger.type;
	
	if(thisTrigger.type === 'ELEMENT_VISIBILITY'){
		triggerArray[trigid].filter += "~ querySelector: " + triggerParms.selectorType + "~" + triggerParms.elementSelector;
	
	}else if(thisTrigger.type === 'TRIGGER_GROUP'){
		triggerArray[trigid].filter += "~ triggerIds: " +  groupOfTriggers.join(",");
	}


}



triggerArray[trigid].parentFolderId = thisTrigger.parentFolderId;





i++;
});

return triggerArray;
}






function getFormattedTags(tagsList){


    var tagStorage = {};
    var tgid = 0;
    tagsList.forEach(function(tagData){
    
    tgid = tagData.tagId;
    tagType = tagData.type;

   // console.log(tgid)



    tagStorage[tgid] = {};


    tagStorage[tgid].accountId = tagData.accountId; 
    tagStorage[tgid].containerId = tagData.containerId; 
    tagStorage[tgid].name = tagData.name; 
    tagStorage[tgid].type = tagData.type; 
    tagStorage[tgid].paused = tagData.paused ? tagData.paused : ""; 
    tagStorage[tgid].tagId = tgid; 
    //console.log(tagData.setupTag)
    tagStorage[tgid].setupTag = tagData.setupTag ? tagData.setupTag[0].tagName : ""; 
    
    tagStorage[tgid].scheduleEndMs = tagData.scheduleEndMs ? tagData.scheduleEndMs : ""; 
    tagStorage[tgid].scheduleStartMs = tagData.scheduleStartMs ? tagData.scheduleStartMs : ""; 
    tagStorage[tgid].notes = tagData.notes ? tagData.notes : ""; 
    
    tagStorage[tgid].parentFolderId = tagData.parentFolderId ? tagData.parentFolderId : ""; 
    tagStorage[tgid].tagFiringOption = tagData.tagFiringOption ? tagData.tagFiringOption : ""; 
    tagStorage[tgid].firingTriggerId = tagData.firingTriggerId ? tagData.firingTriggerId : {}; 
    tagStorage[tgid].blockingTriggerId = tagData.blockingTriggerId ? tagData.blockingTriggerId : {};
    
    tagStorage[tgid].monitoringMetadataTagNameKey = tagData.monitoringMetadataTagNameKey ? tagData.monitoringMetadataTagNameKey : ""; 
    tagStorage[tgid].consentSettings = tagData.consentSettings ? tagData.consentSettings.consentStatus : ''; 
    tagStorage[tgid].monitoringMetadata = tagData.monitoringMetadata ? tagData.monitoringMetadata : {}; 
    


    //init PARAMS
    tagStorage[tgid].parameter = {};

    // TEMPLATEs
    tagStorage[tgid].parameter.advertisingFeaturesType = "";
    tagStorage[tgid].parameter.eventAction = "";
    tagStorage[tgid].parameter.eventCategory = "";
    tagStorage[tgid].parameter.eventLabel = "";
    tagStorage[tgid].parameter.eventName = ""; // gaawe
    tagStorage[tgid].parameter.eventValue = "";
    tagStorage[tgid].parameter.gaSettings = "";
    tagStorage[tgid].parameter.html = "";
    tagStorage[tgid].parameter.linkerDomains = ""; // gclidw
    tagStorage[tgid].parameter.measurementId = ""; // gaawe
    tagStorage[tgid].parameter.optimizeContainerId = ""; //opt
    tagStorage[tgid].parameter.parselySiteId = "";
    tagStorage[tgid].parameter.trackingId = ""; // uaid
    tagStorage[tgid].parameter.trackType = "";
    tagStorage[tgid].parameter.useDebugVersion = "";

    //tagStorage[tgid].parameter.id = ""; //bzi linkedin
    //tagStorage[tgid].parameter.twitter_pixel_id = ""; // twitter
    //tagStorage[tgid].parameter.urlPosition = ""; // gclidw
    //tagStorage[tgid].parameter.PLAYERJS_URL = "";
    //tagStorage[tgid].parameter.SPOKENLAYER_URL = "";
    //tagStorage[tgid].parameter.orderId = ""; // Google Ads
    //tagStorage[tgid].parameter.clientId = ""; // csm
    //tagStorage[tgid].parameter.conversionCookiePrefix = ""; // Google Ads
    //tagStorage[tgid].parameter.conversionId = ""; // Google Ads
    //tagStorage[tgid].parameter.conversionLabel = ""; // Google Ads
    //tagStorage[tgid].parameter.conversionValue = ""; // Google Ads
    //tagStorage[tgid].parameter.currencyCode = ""; // Google Ads
    //tagStorage[tgid].parameter.event_type = ""; // Twitter
    //tagStorage[tgid].parameter.hotjar_site_id = ""; // hotjar


    // BOOLEANs
    tagStorage[tgid].parameter.anonymizeIp = "";
    tagStorage[tgid].parameter.decorateFormsAutoLink = "";
    tagStorage[tgid].parameter.doubleClick = "";
    tagStorage[tgid].parameter.enableEcommerce = "";
    tagStorage[tgid].parameter.enableLinkId = "";
    tagStorage[tgid].parameter.enableSendToServerContainer = ""; //gaawc
    tagStorage[tgid].parameter.nonInteraction = "";
    tagStorage[tgid].parameter.overrideGaSettings = "";
    tagStorage[tgid].parameter.sendEcommerceData = ""; //gaawe
    tagStorage[tgid].parameter.sendPageView = ""; //gaawc
    tagStorage[tgid].parameter.setTrackerName = "";
    tagStorage[tgid].parameter.supportDocumentWrite = ""; //html
    tagStorage[tgid].parameter.useDebugVersion = "";
    tagStorage[tgid].parameter.useEcommerceDataLayer = "";
    tagStorage[tgid].parameter.useHashAutoLink = "";
    
    //tagStorage[tgid].parameter.acceptIncoming = ""; //gclidw
    //tagStorage[tgid].parameter.audioEnded = ""; //cvt_
    //tagStorage[tgid].parameter.audioPause = ""; //cvt_
    //tagStorage[tgid].parameter.audioPercentiles = ""; //cvt_
    //tagStorage[tgid].parameter.audioPlay = ""; //cvt_
    //tagStorage[tgid].parameter.audioResume = ""; //cvt_
    //tagStorage[tgid].parameter.audioSeeked = ""; //cvt_
    //tagStorage[tgid].parameter.audioStart = ""; //cvt_
    //tagStorage[tgid].parameter.sessionStart = ""; //cvt_
    //tagStorage[tgid].parameter.debug = ""; //cvt_
    //tagStorage[tgid].parameter.enableConversionLinker = ""; //awct
    //tagStorage[tgid].parameter.enableNewCustomerReporting = ""; //awct
    //tagStorage[tgid].parameter.enableProductReporting = ""; //awct
    //tagStorage[tgid].parameter.enableCookieOverrides = ""; //gclidw
    //tagStorage[tgid].parameter.enableCrossDomain = ""; //gclidw
    //tagStorage[tgid].parameter.enableShippingData = ""; //awct
    //tagStorage[tgid].parameter.enableUrlPassthrough = ""; //gclidw
    //tagStorage[tgid].parameter.error = ""; //cvt_
    //tagStorage[tgid].parameter.formDecoration = ""; //gclidw
    //tagStorage[tgid].parameter.rdp = ""; //awct


    //LISTs
    tagStorage[tgid].parameter.contentGroup = {};
    tagStorage[tgid].parameter.dimension = {};
    tagStorage[tgid].parameter.eventParameters = {}; //gaawe
    tagStorage[tgid].parameter.fieldsToSet = {}; //ua and gaawc
    tagStorage[tgid].parameter.metric = {};
    tagStorage[tgid].parameter.userProperties = {}; //gaawe and gaawc
    //tagStorage[tgid].parameter.event_parameters = {}; //twitter_website_tag




    
    
    // PARAMS
    tagData.parameter.forEach(function(param){

        if(param.type==='boolean'){
            tagStorage[tgid].parameter[param.key] = param.value;




        }else if(param.type==='template'){
            tagStorage[tgid].parameter[param.key] = param.value;
            // console.log("\ntemplate")
        }else if(param.type==='tag_reference'){
            tagStorage[tgid].parameter[param.key] = param.value;
            // console.log("\ntag_reference")
        }else if(param.type==='map'){
            param.pmap.forEach(function(pmap){
                tagStorage[tgid].parameter[pmap[0].value] = pmap[1].value; 	
            });
            // console.log("map")
        }else if(param.type==='list' && param.list){


            param.list.forEach(function(listitem){




                if(param.key === 'eventParameters'){
                    tagStorage[tgid].parameter.eventParameters[listitem.map[0].value] = listitem.map[1].value

                }else if(param.key === 'fieldsToSet'){
                    tagStorage[tgid].parameter.fieldsToSet[listitem.map[0].value] = listitem.map[1].value
    
                }else if(param.key === 'dimension'){
                    tagStorage[tgid].parameter.dimension[listitem.map[0].value] = listitem.map[1].value
    
                }
    
            });
    
            
        }
    

        // console.log(param.key)
        // console.log(param.value)
        
    });
    
    
    });

    
return tagStorage;    
    }



function onOpen() {
  // Create the menu entry for GTM hierarchy
  var menu = SpreadsheetApp.getUi().createAddonMenu();
  menu.addItem('Get GTM Goals', 'getGoals');
  menu.addItem('Get GTM Filters', 'getFilters');
  menu.addItem('Get GTM CDs', 'getCustomDimensions');
  menu.addItem('Get GTM Views', 'getViews');
  menu.addItem('Get GTM Tags', 'buildTagsSheet');

  menu.addToUi();
}    