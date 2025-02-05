module.exports = {
	testEnvironment: "node",
	moduleFileExtensions: ["js", "ts", "tsx", "json"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"^@handlers/(.*)$": "<rootDir>/src/handlers/$1",
		"^@events/(.*)$": "<rootDir>/src/events/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};



