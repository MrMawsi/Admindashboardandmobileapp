import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono().basePath("/make-server-5a58837f");

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// KV Routes
app.post("/kv/get", async (c) => {
  try {
    const { key } = await c.req.json();
    const value = await kv.get(key);
    return c.json({ value });
  } catch (e) {
    console.error("KV Get Error:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.post("/kv/set", async (c) => {
  try {
    const { key, value } = await c.req.json();
    await kv.set(key, value);
    return c.json({ success: true });
  } catch (e) {
    console.error("KV Set Error:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.post("/kv/del", async (c) => {
  try {
    const { key } = await c.req.json();
    await kv.del(key);
    return c.json({ success: true });
  } catch (e) {
    console.error("KV Del Error:", e);
    return c.json({ error: e.message }, 500);
  }
});

app.post("/kv/get-by-prefix", async (c) => {
  try {
    const { prefix } = await c.req.json();
    const values = await kv.getByPrefix(prefix);
    return c.json({ values });
  } catch (e) {
    console.error("KV Prefix Error:", e);
    return c.json({ error: e.message }, 500);
  }
});

Deno.serve(app.fetch);


