module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js)',
    '**/?(*.)+(spec|test).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-push-notification|@react-navigation|expo|@expo)/)'
  ]
};