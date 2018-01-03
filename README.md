# Hackathon Popbus API
## Request Token
Each group has their own request token which is a pair of strings, client ID and client secret. Request token is required to request all the APIs. To make any request, you have to pass your client ID and client secret through the request header as follows.
```http
Client-ID: <Your-Client-ID>
Client-Secret: <Your-Client-Secret>
```
Different tokens can perform different number of requests per minute. Individual token can perform up to 30 requests per minute. Group token can perform up to 100 requests per minute. The number of total and remaining requests can be observed at the response header.

**Example:**
```http
X-Request-Limit: 30
X-Request-Remaining: 27
```
```http
X-Request-Limit: 100
X-Request-Remaining: 63
```