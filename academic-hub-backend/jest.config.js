/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/*.test.js',
        '**/*.spec.js'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ['js', 'json'],
    verbose: true,
    testTimeout: 30000,
    detectOpenHandles: true,
    forceExit: true,
    maxWorkers: 1
};
