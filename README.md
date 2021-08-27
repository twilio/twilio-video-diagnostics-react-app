# Twilio Video Diagnostics App
*The Twilio Video Diagnostics App is currently in beta. If you have feedback on how we can improve this application, we would love to hear from you. Feel free to provide this feedback by opening an Issue.*

## What is it
This application demonstrates a diagnostics tool for testing a participant's ability to have a quality video call with the Twilio platform. It can be used as part of onboarding to ensure a successful first video call or for diagnosing issues that relate to the device, software, or network conditions of the end-user. It is built with [Twilio's Programmable Video JS SDK](https://github.com/twilio/rtc-diagnostics) and [Twilio's RTC Diagnostics SDK](https://github.com/twilio/rtc-diagnostics). 

![](https://user-images.githubusercontent.com/11685703/131178895-a8995c2f-1fbd-451a-8949-2bfa4040b4f2.gif)
<p align="center">
    <i>The happy path</i>
</p>

## What it tests

1. Access and permissions to the camera and microphone 
2. Local audio and video via interactive camera, microphone, and speaker tests 
3. Operating system and browser support
4. Connectivity to the Twilio cloud
5. Network performance and expected call quality

## Features 
- Stepwise tests for device and software setup, connectivity with Twilio, and network performance 
- Actionable user recommendations when tests fail
- Approachable UX for non-technical users with access to network statistics for those who need it
- Downloadable JSON report of the exhaustive test results
- Customizable and ready for self hosting or embedding into other web applications
- Free to deploy to [Twilio Serverless](https://www.twilio.com/docs/labs/serverless-toolkit) and no costs associated with usage 


## Prerequisites

- A Twilio account. Sign up for free [here](https://www.twilio.com/try-twilio). 
- Node.js v14+
- NPM v6+ (comes installed with newer Node versions)

## Install Dependencies
Run `npm install` to install all the dependencies from NPM. 

## Deploy the App
Before deploying the app, add your Twilio Account SID and Auth Token to a `.env` file (see [.env.example](.env.example) for an example). The app is deployed to Twilio with a single command:
 
	$ npm run serverless:deploy

When deployment has finished, the Twilio Serverless URL for the application will be printed to the console. This URL can be used to access the application: 

	App deployed to: https://rtc-diagnostics-video-xxxxxxxx-xxxx-dev.twil.io

To view the app URL at any time, you can run the following command: 

	$ npm run serverless:list
	
A few things to note:
 
* The serveless deployment will expire after one week and is not meant for production
* When hosting this application, we recommend you use the same domain as your video service. This will ensure the end-user's device access and permissions for the diagnostics tests align with those of your video application.

## Local Development
In order to develop this app on your local machine, you will first need to deploy all needed endpoints to Twilio Serverless. To do this, complete the steps in the "Deploy the App" section above.

Once the endpoints are deployed, add the app's URL as the `PROXY_URL` in the `.env` file. Then you can start a local development server by running the following command:

	$ npm run start

## Tests
Run `npm test` to run all unit tests.

Run `npm run test:serverless` to run all unit and E2E tests on the Serverless scripts. This requires that your Twilio account credentials are stored in the `.env` file.

## License
See [LICENSE](LICENSE.md). 