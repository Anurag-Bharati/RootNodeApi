const { default: mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("./server.mock");
const { SpecificRoutes } = require("../src/config/constant");
const api = supertest(app);

const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDA2Y2Y1MGY4NjNkOWVjYjgyNWIyYjgiLCJ1c2VybmFtZSI6ImFwaS10ZXN0LWFhcGktdGVzdC1hIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NzgxNjg3NDgsImV4cCI6MTY3OTQ2NDc0OH0.cAfXSfFD0zCMq3hRH3k4yEjVDqQaspzNxGfSXPTeAV4";

beforeAll(async () => {});

describe("Get public stories", () => {
    describe("given no token", () => {
        it("should return 200", async () => {
            await api
                .get(SpecificRoutes.GET_PUBLIC_STORIES.path)
                .send()
                .expect(200);
        });
    });
});

describe("Make a story", () => {
    describe("given no token", () => {
        it("should return 401", async () => {
            await api.post(SpecificRoutes.CREATE_STORY.path).send().expect(401);
        });
    });
});

describe("Make a story", () => {
    describe("given a valid token", () => {
        it("should return 201", async () => {
            var data = {
                quote: "Hi there",
            };
            await api
                .post(SpecificRoutes.CREATE_STORY.path)
                .send(data)
                .set("Authorization", `Bearer ${TOKEN}`)
                .expect(201);
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
