/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/e2e/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
    },
    transformIgnorePatterns: ['/node_modules/(?!(.*?))'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^next/font/google$': '<rootDir>/tests/__mocks__/nextFontMock.js'
    }
    ,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
