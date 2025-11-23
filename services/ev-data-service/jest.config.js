module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only run tests from `src/` — ignore compiled `dist/` tests to avoid duplicate/old runs.
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
};
