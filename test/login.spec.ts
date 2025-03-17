import { test, expect } from "@playwright/test";

test("Login flow", async ({ page }) => {
  // Navigate to login page
  await page.goto("http://localhost:3000/#/login");

  // Log requests and responses to debug
  page.on("request", (request) => console.log("Request:", request.url()));
  page.on("response", (response) =>
    console.log("Response:", response.url(), response.status()),
  );

  // Wait for the correct login request
  const loginResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes("/users/auth/jwt/create") && // Ensure this is correct
      response.status() === 200,
    { timeout: 60000 }, // Increase timeout
  );

  // Fill in credentials
  await page.fill('input[name="email"]', "test_annotator1@anudesh.org");
  await page.fill('input[name="password"]', "anudesh_admin@123");

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for login API response
  const response = await loginResponse;
  const responseBody = await response.json();

  // Check if access token is received
  expect(responseBody.access).toBeDefined();

  // Wait for authentication to complete
  await page.waitForLoadState("networkidle");

  // Ensure user is redirected after successful login
  await expect(page).toHaveURL(
    "http://localhost:3000/?email=test_annotator3%40anudesh.org&password=anudesh_admin%40123#/projects",
  );
});

test("Forgot Password Flow", async ({ page }) => {
  // Step 1: Navigate to the Forgot Password page
  await page.goto("http://localhost:3000/#/forgot-password"); // Replace with your actual URL

  // Step 2: Enter a valid email
  await page.fill("input", "test_annotator3@anudesh.org"); // Adjust the selector if needed

  // Step 3: Click the Reset Password button
  await page.click("button"); // Adjust the selector if needed

  // Step 4: Verify redirection to Login Page
  await expect(page).toHaveURL("http://localhost:3000/#/login"); // Replace with your actual login page URL
});
