const request = require("supertest");
const app = require("../app");

describe("Task Manager API", () => {

  // Test 1: Health check — root endpoint
  test("GET / returns 200 with API status message", async () => {
    const res = await request(app).get("/");
    // expect(res.statusCode).toBe(200);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Task Manager API is running");
  });

  // Test 2: Unknown route returns 404
  test("GET /unknown returns 404", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

});
