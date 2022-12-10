module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: [
      '**/tests/**/*.(spec|test).[jt]s',
      '**/?(*.)+(spec|test).[tj]s',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};
