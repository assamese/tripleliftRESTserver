/**
 * aggregatesGET - Triplelift REST server
 * 1. Read RAW CSV data
 * 2. Convert CSV data into an array of JSON objects
 * 3. Filter JSON objects that belong to the given advertiser_id(s) AND for the past week 
 * 4. Aggregate JSON Objects and tranform JSON to desired output format
 * 5. Return the transformed JSON objects in the REST-response
 */

'use strict';

var csv2jsonHelper = require('../helpers/csvjson');
var csvRawDataReader = require('../helpers/csvreader');
var config = require("../config");


/**
** Utility date function
**  @param {Boolean} mondayStart - falsey for Sunday as first day of week,
**                                 truthy for Monday as first day of week
**  @returns {Date} - date for first day of week
*/
function getStartOfWeek(mondayStart) {

  // copy date
  var d = new Date();
  // days to previous Sunday
  var shift = d.getDay();

  // Adjust shift if week starts on Monday
  if (mondayStart) {
    shift = shift? shift - 1 : 6;
  }

  // Shift to start of week
  d.setDate(d.getDate() - shift);
  return d;
}


/**
 * Filter JSON objects that belong to the given advertiser_id AND for the past week 
 */
function filterJSON(advID, jsonObjectsFromcsvRows) {

  var filteredByAdvID = jsonObjectsFromcsvRows.filter(function (item) {
    //console.log('item.advertiser_id - ' + item.advertiser_id);
    return item.advertiser_id == advID;
  });

  //console.log("date for start-week - " + getStartOfWeek(false).toISOString().slice(0, 10));

  var filteredByAdvID_and_date = filteredByAdvID.filter(function (item) {
    //console.log('item.ymd - ' + item.Event_Date);
    return item.Event_Date <= getStartOfWeek(false).toISOString().slice(0, 10);
  });



  return filteredByAdvID_and_date;
}


/**
 * Aggregate JSON objects 
 */
function aggregateJSON(jsonObjects2aggregate) {

  var result = jsonObjects2aggregate.reduce(
    function (aggregatedObject, jsonObject2aggregate) {
      // On each iteration, add the current jsonObject2aggregate to the aggregatedObject.
      aggregatedObject.ymd = jsonObject2aggregate.Event_Date;
      if (jsonObject2aggregate.Touch_Type == 'click') {
        aggregatedObject.num_clicks++;
      }
      if (jsonObject2aggregate.Touch_Type == 'impression') {
        aggregatedObject.num_impressions++;
      }

      return aggregatedObject;
      }
    , {
      advertiser_id: jsonObjects2aggregate[0].advertiser_id,
      ymd: "",
      num_clicks: 0,
      num_impressions: 0
  });

  return result;
}

/**
* parameters expected in the args:
* advertiser_ids (separated by comma)
**/

exports.aggregatesGET = function(args, res, next) {

  console.log ('aggregatesGET::args.advertiser_ids.value: ' + args.advertiser_ids.value);

  res.setHeader('Content-Type', 'application/json');

  var json2return = []; // to be returned as the response to this REST-call
  var json2returnReady = false; // required for time-out processing

  var timeOut = setTimeout(function() {
      console.log("Processing Time Out....");
      clearTimeout(timeOut);
      if (!json2returnReady) {
        console.log("Request Timed Out");
        res.write("Request Timed Out");
        res.end();
        return;
      } else {
        console.log("Request did NOT Time Out");
      }

    }, config.timeout4Request);


  var csvRawData = csvRawDataReader.getRawcsv();

  var jsonObjectsFromcsv = csv2jsonHelper.csv2json(csvRawData
      , {
        delim: ",",
        textdelim: "\""
        }
      );

  //console.log('jsonObjectsFromcsv.rows[0].advertiser_id - ' + jsonObjectsFromcsv.rows[0].advertiser_id);

  var advertiserIDsFromInput = args.advertiser_ids.value.split(","); // Parameter from REST-call

  // Process data for each advertiser_id 1-by-1
  for (var ii = 0; ii < advertiserIDsFromInput.length; ii++) {
    var advertiserID = advertiserIDsFromInput[ii];

    var filteredJSON = filterJSON(advertiserID, jsonObjectsFromcsv.rows)
    var aggregatedJSON = aggregateJSON(filteredJSON);

    json2return = json2return.concat(aggregatedJSON);
  }

  json2returnReady = true; // required for time-out processing

  if(json2return.length > 0) {
    res.write(JSON.stringify(json2return));
  }
  else {
    console.log ('NO json2return!!');
  }

  res.end();
}


