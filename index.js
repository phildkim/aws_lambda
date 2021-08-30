// @ts-ignore
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = { "Content-Type": "application/json" };
  const date = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    day: "2-digit",
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
    hour12: false,
  });
  try {
    // increments id
    const index = await dynamo.scan({
      TableName: "HeartrateTable"
    })
    .promise()
    .then((data) => data.Count + 1);
    // update DynamoDB HeartrateTable
    body = await dynamo.put({
      TableName: "HeartrateTable",
      Item: {
        id: parseInt(index),
        timestamp: `${date}; ${time}`,
        userid: parseInt(event.queryStringParameters.userid),
        heartrate: parseInt(event.queryStringParameters.heartrate)
      }
    })
    .promise();
    body = `Inserted Id ${index}`;
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  return {
    headers,
    statusCode,
    body,
  };
};
