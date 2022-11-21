import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When instantiated with message 'Unknown endpoint', 404 status code and public message 'Unknown endpoint'", () => {
    test("Then it should return an object with the same properties", () => {
      const expectedError = {
        message: "Unknown endpoint",
        statusCode: 404,
        publicMessage: "Unknown endpoint",
      };

      const customError = new CustomError(
        expectedError.message,
        expectedError.statusCode,
        expectedError.publicMessage
      );

      expect(customError).toHaveProperty("message", expectedError.message);
      expect(customError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
    });
  });
});
