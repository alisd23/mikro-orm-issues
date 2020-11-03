module.exports = {
  rootDir: './src',
  globalSetup: '<rootDir>/test/global-test-setup.ts',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
