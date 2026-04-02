import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello World from Elysia + Bun!")
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (e) {
      return { error: "Database connection failed. Please check your .env configuration." };
    }
  })
  .post("/users", async ({ body }) => {
    try {
      await db.insert(users).values(body);
      return { message: "User created successfully", user: body };
    } catch (e) {
      return { error: "Failed to create user. Ensure your email is unique and DB is connected." };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' })
    })
  })
  .listen(3000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📖 Swagger documentation available at http://localhost:3000/swagger`
);
