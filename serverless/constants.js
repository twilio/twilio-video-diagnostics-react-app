require('dotenv').config();

module.exports = {
  SERVICE_NAME: 'therapify-video-diagnostics',
  API_KEY_NAME: 'RTC Video Diagnostics Key',
  VIDEO_IDENTITY: process.env.VIDEO_IDENTITY || 'RTC_Video_Diagnostics_Test_Identity',
};
