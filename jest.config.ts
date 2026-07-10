import type { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json', useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/test/mocks/fileMock.js',
  },
  testMatch: [
    '<rootDir>/src/tests/unit/**/*.test.ts',
    '<rootDir>/src/tests/unit/**/*.test.tsx',
    '<rootDir>/src/tests/unit/**/*.spec.ts',
    '<rootDir>/src/tests/unit/**/*.spec.tsx',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
};

export default config;
