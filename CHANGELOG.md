# 1.0.0 (September 1, 2021)

This is the initial release of the Twilio Video Diagnostics App. This application provides a more comprehensive demonstration of the [RTCDiagnostics SDK](https://twilio.github.io/rtc-diagnostics/globals.html) and call readiness features within the [JS Video SDK](https://sdk.twilio.com/js/video/releases/2.16.0/docs/) (`Video.isSupported`, Preflight API). The video participants will be the end-users, but the tool serves to solve problems for our customers’ support teams and developers looking to build diagnostics flows within their own application.

This release includes the following features:

- Stepwise tests to diagnose issues due to the local environment of a video participant.
- Provides a recommended course of action when tests fail.
- Easy to download JSON formatted test report for simplified sharing and integration into support workflows.

We welcome contributions and feedback from the community so that we can continue to iterate on this initial set of features in order to provide the best experience for our customers, and their customers.
