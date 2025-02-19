module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@apps/(.*)$": "<rootDir>/../apps/$1",
    "^@backend/(.*)$": "<rootDir>/../backend/$1",
    "^@serverless/(.*)$": "<rootDir>/../serverless/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
    "^@tests/(.*)$": "<rootDir>/../tests/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};
