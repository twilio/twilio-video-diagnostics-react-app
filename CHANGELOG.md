# 1.1.0 (March 30, 2022)

This release contains a new token server, and support for mobile web!

### Token Server

A new server has been added that can be used to run the app locally (by running `npm start` in the terminal), or on a production server of choice (Heroku, AWS, etc.). Please see the [README](README.md) for instructions on how to set up the token server. **Note**, this application can still be deployed to Twilio Serverless by running `npm run serverless:deploy`.

### Mobile Support

The Video Diagnostics App can now be used on mobile devices. Users can access this application via any mobile web browser that is [supported](https://www.twilio.com/docs/video/javascript#supported-browsers) by Twilio Programmable Video.

# 1.0.0 (September 1, 2021)

This is the beta release of the Twilio Video Diagnostics App. This application demonstrates a diagnostics tool for testing a participant's ability to have a quality video call with the Twilio platform. It can be used as part of onboarding to ensure a successful first video call or for diagnosing issues that relate to the device, software, or network conditions of the end-user. It is built with [Twilio's Programmable Video JS SDK](https://sdk.twilio.com/js/video/releases/2.16.0/docs/) and [Twilio's RTC Diagnostics SDK](https://twilio.github.io/rtc-diagnostics/globals.html).

This release includes the following features:

- Stepwise tests to diagnose issues due to the local environment of a video participant.
- Provides a recommended course of action when tests fail.
- Easy to download JSON formatted test report for simplified sharing and integration into support workflows.

We welcome contributions and feedback from the community so that we can continue to iterate on this initial set of features in order to provide the best experience.
