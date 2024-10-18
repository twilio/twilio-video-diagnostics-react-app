# Twilio Video Diagnostics App

## What is it

This application demonstrates a diagnostics tool for testing a participant's ability to have a quality video call with the Twilio platform. It can be used as part of onboarding to ensure a successful first video call or for diagnosing issues that relate to the device, software, or network conditions of the end-user. It is built with [Twilio's Programmable Video JS SDK](https://github.com/twilio/rtc-diagnostics) and [Twilio's RTC Diagnostics SDK](https://github.com/twilio/rtc-diagnostics).

![](https://user-images.githubusercontent.com/11685703/131178895-a8995c2f-1fbd-451a-8949-2bfa4040b4f2.gif)

<p align="center">
    <i>A Twilio hosted version of this app can be found at <a href="https://video-diagnostics.twilio.com">https://video-diagnostics.twilio.com</a>.</i>
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
- No costs associated with deploying the app to [Twilio Serverless](https://www.twilio.com/docs/labs/serverless-toolkit)

## Prerequisites

- A Twilio account. Sign up for free [here](https://www.twilio.com/try-twilio).
- Node.js v14+
- NPM v6+ (comes installed with newer Node versions)

## Install Dependencies

Run `npm install` to install all the dependencies from NPM.

## Deploy the App

Before deploying the app, add your Twilio Account SID and Auth Token to a `.env` file (see [.env.example](.env.example) for an example). The app is deployed to Twilio with a single command:

    npm run serverless:deploy

When deployment has finished, the Twilio Serverless URL for the application will be printed to the console. This URL can be used to access the application:

    App deployed to: https://rtc-diagnostics-video-xxxxxxxx-xxxx-dev.twil.io

To view the app URL at any time, you can run the following command:

    npm run serverless:list

A few things to note:

- The serverless deployment will expire after one week and is not meant for production
- When hosting this application, we recommend you use the same domain as your video service. This will ensure the end-user's device access and permissions for the diagnostics tests align with those of your video application.

## Delete the App

To remove the Serverless app from Twilio, run the following command:

    npm run serverless:remove

## Local Development

### Running a local token server

This application requires an access token to run the [Preflight](src/components/AppStateProvider/usePreflightTest/usePreflightTest.ts) and [Bitrate](src/components/AppStateProvider/useBitrateTest/useBitrateTest.ts) tests. The included local token [server](server/index.ts) provides the application with access tokens and TURN credentials. This token server can be used to run the app locally, and it is the server that is used when this app is run in development mode with `npm start`. Perform the following steps to setup the local token server:

- If you haven't done so already, create an account in the [Twilio Console](https://www.twilio.com/console) and take note of your Account SID.
- Create a new API Key in the [API Keys Section](https://www.twilio.com/console/video/project/api-keys) under Programmable Video Tools in the Twilio Console. Take note of the SID and Secret of the new API key.
- Store your Account SID, API Key SID, and API Key Secret, in a new file called `.env` (see [.env.example](.env.example) for an example).

Now the local token server (see [server/index.ts](server/index.ts)) can dispense Access Tokens and TURN credentials to run the Preflight and Bitrate tests.

### Running the App locally

Run the app locally with

    npm start

This will start the local token server and run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console. If you need to run only the server on its own, you can start the token server locally with

    npm run server

The token server runs on port 8081.

The server provided with this application uses the same endpoints as the [serverless](serverless/functions/app) endpoints that are used when the app is deployed to Twilio Serverless.

## Building

Build the app by running:

    npm run build

This will build the static assets for the application in the `build/` directory.

## Tests

Run `npm test` to run all unit tests.

Run `npm run test:serverless` to run all unit and E2E tests on the Serverless scripts. This requires that your Twilio account credentials are stored in the `.env` file.

## License

See [LICENSE](LICENSE.md).
