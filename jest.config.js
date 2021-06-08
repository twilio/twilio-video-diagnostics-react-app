module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    reporters: ['default', 'jest-junit'],
    coveragePathIgnorePatterns: ['node_modules'],
    clearMocks: true,
    snapshotSerializers: ['enzyme-to-json/serializer'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  };
