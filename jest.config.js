module.exports = {
  roots: ['<rootDir>/src'],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },

  preset: 'ts-jest',

  transformIgnorePatterns: ['<rootDir>/node_modules/react'],

  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  moduleNameMapper: {
    // "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    // <rootDir>/__mocks__/fileMock.js",
        // "\\.(css|less)$": "identity-obj-proxy"
    // },
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  },
};
