module.exports = {
  preset: 'ts-jest',
  // Use jsdom so React components can render in tests
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
