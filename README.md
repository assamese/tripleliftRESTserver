# tripleliftRESTserver

## Overview

Triplelift REST server
 The main logic is in controllers/AggregatesService.js (The rest of the code is plumbing for REST/Swagger)
 1. Read RAW CSV data
 2. Convert CSV data into an array of JSON objects
 3. Filter JSON objects that belong to the given advertiser_id(s) AND for the past week 
 4. Aggregate JSON Objects and tranform JSON to desired output format
 5. Return the transformed JSON objects in the REST-response

 Also, takes care of time-out logic

### Running the server
To run the server, follow these simple steps:

```
npm install
node tlserver.js
```
Triplelift server listens on port 3050 (http://localhost:3050)
Swagger-ui is available on http://localhost:3050/docs
```
Quick Demo (not guaranteed to be running !)
Server - http://52.33.218.252:3050/api/aggregates?advertiser_ids=123%2C456%2C678
Docs - http://ec2-52-33-218-252.us-west-2.compute.amazonaws.com:3050/docs/
```

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.
