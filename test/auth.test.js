const { default: mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("./server.mock");
const { SpecificRoutes } = require("../src/config/constant");
const api = supertest(app);

const dummy = "api-test-a";

beforeAll(async () => {});

describe("Registration", () => {
    describe("given valid credentials", () => {
        it("should return 201 or if exist 409", async () => {
            // Arrange
            const newUser = {
                fname: dummy,
                lname: dummy,
                password: dummy,
                email: dummy + "@test.com",
            };
            await api
                .post(SpecificRoutes.REGISTER.path)
                .send(newUser)
                .expect(409);
        });
    });
});

describe("Login", () => {
    describe("given valid credentials", () => {
        it("should return 200", async () => {
            // Arrange
            const user = {
                username: dummy + dummy,
                password: dummy,
            };
            await api.post(SpecificRoutes.LOGIN.path).send(user).expect(200);
        });
    });
});

describe("Logout", () => {
    describe("given valid credentials", () => {
        it("should return 200", async () => {
            // Arrange
            const user = {
                username: dummy + dummy,
                password: dummy,
            };
            await api.post(SpecificRoutes.LOGOUT.path).send().expect(204);
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
