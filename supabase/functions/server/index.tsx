import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

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
app.get("/make-server-a748bb9b/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all inventory items
app.get("/make-server-a748bb9b/inventory", async (c) => {
  try {
    const items = await kv.getByPrefix("inventory:");
    return c.json({ success: true, data: items });
  } catch (error) {
    console.log("Error fetching inventory:", error);
    return c.json({ success: false, error: "Failed to fetch inventory items" }, 500);
  }
});

// Create new inventory item
app.post("/make-server-a748bb9b/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const itemId = `inventory:${body.batchId}`;

    const inventoryItem = {
      id: body.batchId,
      batchId: body.batchId,
      product: body.product,
      stock: body.stock,
      cost: body.cost,
      expiry: body.expiry,
      daysLeft: calculateDaysLeft(body.expiry),
      status: determineStatus(calculateDaysLeft(body.expiry), body.salesPace),
      salesPace: body.salesPace,
      createdAt: new Date().toISOString(),
    };

    await kv.set(itemId, inventoryItem);
    console.log(`Created inventory item: ${itemId}`);

    return c.json({ success: true, data: inventoryItem });
  } catch (error) {
    console.log("Error creating inventory item:", error);
    return c.json({ success: false, error: "Failed to create inventory item" }, 500);
  }
});

// Update inventory item
app.put("/make-server-a748bb9b/inventory/:batchId", async (c) => {
  try {
    const batchId = c.req.param("batchId");
    const body = await c.req.json();
    const itemId = `inventory:${batchId}`;

    const existingItem = await kv.get(itemId);
    if (!existingItem) {
      return c.json({ success: false, error: "Inventory item not found" }, 404);
    }

    const updatedItem = {
      ...existingItem,
      ...body,
      daysLeft: body.expiry ? calculateDaysLeft(body.expiry) : existingItem.daysLeft,
      status: body.expiry && body.salesPace
        ? determineStatus(calculateDaysLeft(body.expiry), body.salesPace)
        : existingItem.status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(itemId, updatedItem);
    console.log(`Updated inventory item: ${itemId}`);

    return c.json({ success: true, data: updatedItem });
  } catch (error) {
    console.log("Error updating inventory item:", error);
    return c.json({ success: false, error: "Failed to update inventory item" }, 500);
  }
});

// Delete inventory item
app.delete("/make-server-a748bb9b/inventory/:batchId", async (c) => {
  try {
    const batchId = c.req.param("batchId");
    const itemId = `inventory:${batchId}`;

    await kv.del(itemId);
    console.log(`Deleted inventory item: ${itemId}`);

    return c.json({ success: true, message: "Inventory item deleted" });
  } catch (error) {
    console.log("Error deleting inventory item:", error);
    return c.json({ success: false, error: "Failed to delete inventory item" }, 500);
  }
});

// Helper function to calculate days left until expiry
function calculateDaysLeft(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to determine status based on days left and sales pace
function determineStatus(daysLeft: number, salesPace: string): string {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 1 && salesPace === "low") return "donate";
  if (daysLeft <= 2) return "flash";
  if (daysLeft <= 5 && salesPace !== "high") return "internal";
  return "fresh";
}

Deno.serve(app.fetch);