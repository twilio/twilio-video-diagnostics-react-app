const core = require('../serverless/middleware/recaptcha_core.private');
export const verifyRecaptchaToken = core.verifyRecaptchaToken;
export const SCORE_THRESHOLD = core.SCORE_THRESHOLD;
