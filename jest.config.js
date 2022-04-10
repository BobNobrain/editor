module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: [
      '**/tests/**/*.[jt]s',
      '**/?(*.)+(spec|test).[tj]s',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};
