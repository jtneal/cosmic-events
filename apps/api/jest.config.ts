export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['.dto.ts', '.entity.ts', '.module.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
};
