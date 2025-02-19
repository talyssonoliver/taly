module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@events/(.*)$": "<rootDir>/src/events/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};
