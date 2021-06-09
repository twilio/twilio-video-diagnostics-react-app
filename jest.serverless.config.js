module.exports = {
    roots: ['<rootDir>/serverless'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/serverless/__tests__/setupTests.js'],
    reporters: ['default', 'jest-junit'],
    testEnvironment: 'node',
    testTimeout: 60000,
  };