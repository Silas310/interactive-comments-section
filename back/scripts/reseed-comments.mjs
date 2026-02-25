import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL =
  process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

function toPastDate(relativeLabel) {
  if (!relativeLabel || typeof relativeLabel !== "string") {
    return new Date().toISOString();
  }

  const normalized = relativeLabel.trim().toLowerCase();
  const match = normalized.match(
    /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i,
  );

  if (!match) {
    const maybeDate = new Date(relativeLabel);
    if (!Number.isNaN(maybeDate.getTime())) {
      return maybeDate.toISOString();
    }
    return new Date().toISOString();
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  const diff = value * (multipliers[unit] || 0);
  return new Date(Date.now() - diff).toISOString();
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Request failed: ${options.method || "GET"} ${url} -> ${response.status} ${response.statusText}\n${text}`,
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

async function reseed() {
  const dataPath = path.resolve(__dirname, "..", "public", "data", "data.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  const seedData = JSON.parse(raw);

  const comments = Array.isArray(seedData.comments) ? seedData.comments : [];

  console.log(`API base: ${API_BASE_URL}`);
  console.log(`Seed comments: ${comments.length}`);

  const existingComments = await requestJson(`${API_BASE_URL}/api/comments`);
  for (const item of existingComments) {
    await requestJson(`${API_BASE_URL}/api/comments/${item._id}`, {
      method: "DELETE",
    });
  }
  console.log(`Deleted comments: ${existingComments.length}`);

  let createdComments = 0;
  let createdReplies = 0;

  for (const comment of comments) {
    const createdComment = await requestJson(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment.content,
        user: comment.user,
      }),
    });

    await requestJson(`${API_BASE_URL}/api/comments/${createdComment._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: comment.score ?? 0,
        createdAt: toPastDate(comment.createdAt),
      }),
    });
    createdComments += 1;

    const replies = Array.isArray(comment.replies) ? comment.replies : [];
    for (const reply of replies) {
      const updatedParent = await requestJson(
        `${API_BASE_URL}/api/comments/${createdComment._id}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: reply.content,
            replyingTo: reply.replyingTo,
            user: reply.user,
          }),
        },
      );

      const createdReply =
        updatedParent?.replies?.[updatedParent.replies.length - 1];
      if (!createdReply?._id) {
        throw new Error("Could not resolve created reply ID while reseeding.");
      }

      await requestJson(`${API_BASE_URL}/api/comments/${createdReply._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: reply.score ?? 0,
          createdAt: toPastDate(reply.createdAt),
        }),
      });

      createdReplies += 1;
    }
  }

  console.log(`Created comments: ${createdComments}`);
  console.log(`Created replies: ${createdReplies}`);
  console.log("Reseed completed.");
}

reseed().catch((error) => {
  console.error("Reseed failed:", error.message);
  process.exit(1);
});
