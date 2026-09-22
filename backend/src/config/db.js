const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

/**
 * Atlas/local can already have a database with different casing (e.g. `Zeevan` vs `zeevan`).
 * Writes to the wrong segment trigger: "db already exists with different case".
 */
function normalizeMongoUri(uri) {
  if (!uri || typeof uri !== "string") return uri;
  let normalized = uri;
  normalized = normalized.replace(/(mongodb(?:\+srv)?:\/\/[^/]+\/)zeevan(?=\/|$|\?)/i, "$1Zeevan");
  if (process.env.MONGO_DB_NAME) {
    normalized = normalized.replace(/(mongodb(?:\+srv)?:\/\/[^/]+\/)[^/?]+/, `$1${process.env.MONGO_DB_NAME}`);
  }
  return normalized;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isLocalUnreachable(error) {
  const text = `${error?.name || ""} ${error?.message || ""}`;
  return /ECONNREFUSED|MongoServerSelectionError|connect ECONNREFUSED/i.test(text);
}

async function connectOnce(mongoUri) {
  return mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 4000,
    maxPoolSize: 10,
  });
}

async function startMemoryMongo() {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mem = await MongoMemoryServer.create({
    instance: { dbName: "kankreg_ecommerce" },
  });
  const uri = mem.getUri("kankreg_ecommerce");
  await connectOnce(uri);
  console.warn(
    "[mongo] Local MongoDB is not running on 27017. Using an in-memory database for this process."
  );
  console.warn("[mongo] Data resets when the API stops. Install MongoDB or Docker for persistence.");
  return mem;
}

async function connectDB() {
  const rawUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kankreg_ecommerce";
  const mongoUri = normalizeMongoUri(rawUri);
  if (mongoUri !== rawUri) {
    console.warn("MongoDB URI normalized for database name casing.");
  }

  const looksLocal = /127\.0\.0\.1|localhost/i.test(mongoUri);
  const attempts = looksLocal
    ? Math.max(1, Number(process.env.MONGO_CONNECT_ATTEMPTS) || 2)
    : Math.max(1, Number(process.env.MONGO_CONNECT_ATTEMPTS) || 5);
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const connection = await connectOnce(mongoUri);
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      lastError = error;
      console.warn(`[mongo] Connect attempt ${i}/${attempts} failed: ${error.message}`);
      if (i < attempts) await delay(1200);
    }
  }

  const allowMemory =
    process.env.NODE_ENV !== "production" && process.env.ALLOW_MEMORY_MONGO !== "false";
  if (allowMemory && isLocalUnreachable(lastError)) {
    try {
      return await startMemoryMongo();
    } catch (memError) {
      console.error(`[mongo] In-memory fallback failed: ${memError.message}`);
    }
  }

  console.error(`MongoDB connection error: ${lastError.message}`);
  console.error("Start MongoDB on 27017, or set MONGO_URI (Atlas), then restart the API.");
  process.exit(1);
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = connectDB;
module.exports.isDbReady = isDbReady;
