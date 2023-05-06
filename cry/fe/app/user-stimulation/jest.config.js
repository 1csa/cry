module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '.*\\.(vue)$': 'vue-jest',
  },
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTestsAfterEnv.ts'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
};
