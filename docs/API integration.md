# API integration
This docs describes how users can integrate with our system through our public RESTFUL HTTP API.


## Getting started
1. Login to muwno <https://app.muwno.com>
1. Create an API key here <https://app.muwno.com/api-key>
    - Note that you can only create an API key if you are an Organisation Owner or Organisation Admin. Talk to the Owner or an Admin to give you the right access or get them to create the API key for you.
    - If you need help, email us at *help@muwno.com*
1. Once you have the API key, you can start making requests!
1. To make requests with the API key, set the API key in your request header like
    ```
    x-api-key: YOUR_API_KEY
    ```


## What can users do with our API?
1. Programmatically submit PMF Survey responses
    - Usecase: If you want to build and maintain your own PMF Survey Form UI instead of using our web based form, and only use our system for data storage and analysis.
    - API Example, set your own $PRODUCT_ID and $API_KEY
        ```http
        POST api.muwno.com/v1/api/feedback/submit/$PRODUCT_ID
        content-type: application/json
        x-api-key: $API_KEY

        {
            "a1": 1 | 2 | 3,
            "a2": "User's answer to 'What type of people do you think would most benefit from PRODUCT_NAME'",
            "a3": "User's answer to 'What is the main benefit you receive from PRODUCT_NAME'",
            "a4": "User's answer to 'How can we improve PRODUCT_NAME for you?'"
        }
        ```



## API limitations
### Rate Limiting
Currently rate limited for 600 requests over a 3 seconds rolling time window.
If you have issues with this or need more, please reach out to us.
Might be occasionally more or less.
The system if running multiple instances will be number of instances * the rate limit.