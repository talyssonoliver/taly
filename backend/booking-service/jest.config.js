module.exports = {
	testEnvironment: "node",
	moduleFileExtensions: ["js", "ts", "tsx", "json"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
		"^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
		"^@services/(.*)$": "<rootDir>/src/services/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};
