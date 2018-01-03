# Hackathon Popbus API
## Request Token
Each group has their own request token which is a pair of strings, client ID and client secret. Request token is required to request all the APIs. To make any request, you have to pass your client ID and client secret through the request header as follows.
```http
Client-ID: <Your-Client-ID>
Client-Secret: <Your-Client-Secret>
```
Each request token can make up to 60 requests per minute. The number of remaining requests in that minute can be observed at the response header.
```http
X-Request-Limit: 60
X-Request-Remaining: [0-59]
```
