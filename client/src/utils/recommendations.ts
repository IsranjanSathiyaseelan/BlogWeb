
import type { BlogPost } from "../types/blog";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all",
  "am", "an", "and", "any", "are", "as", "at", "be",
  "because", "been", "before", "being", "below", "between",
  "both", "but", "by", "can", "could", "did", "do", "does",
  "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her",
  "here", "him", "his", "how", "i", "if", "in", "into",
  "is", "it", "its", "me", "more", "most", "my", "no",
  "not", "of", "off", "on", "once", "only", "or", "other",
  "our", "out", "over", "own", "same", "she", "should",
  "so", "some", "such", "than", "that", "the", "their",
  "them", "then", "there", "these", "they", "this",
  "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "we", "were", "what", "when", "where",
  "which", "while", "who", "why", "with", "would", "you",
  "your"
]);

interface DocumentData {
  post: BlogPost;
  titleTokens: Set<string>;
  keywordTokens: Set<string>;
  category: string;
  vector: Map<string, number>;
}

export interface RecommendationScore {
  post: BlogPost;
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/[\s_-]+/)
    .filter(
      word => word.length >= 2 && !STOP_WORDS.has(word)
    );
}

function getDescription(post: BlogPost): string {
  return (
    (post as BlogPost & { description?: string }).description || ""
  );
}

function getCategory(post: BlogPost): string {
  return (post.category || "").trim().toLowerCase();
}

function getKeywords(post: BlogPost): Set<string> {
  return new Set(
    (post.keywords || []).flatMap(keyword => tokenize(keyword))
  );
}

function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Sublinear term frequency.
  for (const [term, count] of tf) {
    tf.set(term, 1 + Math.log(count));
  }

  return tf;
}

function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>
): number {
  if (!a.size || !b.size) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const value of a.values()) {
    normA += value * value;
  }

  for (const value of b.values()) {
    normB += value * value;
  }

  const smaller = a.size < b.size ? a : b;
  const larger = a.size < b.size ? b : a;

  for (const [term, value] of smaller) {
    dot += value * (larger.get(term) || 0);
  }

  if (!normA || !normB) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function overlapScore(
  a: Set<string>,
  b: Set<string>
): number {
  if (!a.size || !b.size) return 0;

  let intersection = 0;

  for (const term of a) {
    if (b.has(term)) intersection++;
  }

  // Dice coefficient.
  return (2 * intersection) / (a.size + b.size);
}

function buildDocumentText(post: BlogPost): string {
  return [
    post.title || "",
    post.title || "",
    post.title || "",
    post.excerpt || "",
    getDescription(post)
  ].join(" ");
}

export function getRecommendedPosts(
  targetPost: BlogPost,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  if (!targetPost || !Array.isArray(allPosts) || !allPosts.length) {
    return [];
  }

  const safeLimit = Math.min(
    5,
    Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 3))
  );

  if (safeLimit === 0) return [];

  // 1. Remove current article and duplicate candidates.
  const targetId = String(targetPost.id);
  const targetSlug = targetPost.slug?.trim().toLowerCase();

  const seen = new Set<string>();
  const candidates: BlogPost[] = [];

  for (const post of allPosts) {
    if (!post) continue;

    const id = String(post.id);
    const slug = post.slug?.trim().toLowerCase();

    if (
      id === targetId ||
      (targetSlug && slug === targetSlug) ||
      seen.has(id) ||
      (slug && seen.has(`slug:${slug}`))
    ) {
      continue;
    }

    seen.add(id);
    if (slug) seen.add(`slug:${slug}`);

    candidates.push(post);
  }

  if (!candidates.length) return [];

  // 2. Build the corpus.
  const corpus = [targetPost, ...candidates];

  const documents = corpus.map(post => ({
    post,
    tokens: tokenize(buildDocumentText(post))
  }));

  // 3. Calculate document frequency.
  const df = new Map<string, number>();

  for (const document of documents) {
    for (const term of new Set(document.tokens)) {
      df.set(term, (df.get(term) || 0) + 1);
    }
  }

  // 4. Calculate smoothed IDF.
  const totalDocs = documents.length;
  const idf = new Map<string, number>();

  for (const [term, frequency] of df) {
    idf.set(
      term,
      Math.log(1 + (totalDocs + 1) / (frequency + 1)) + 1
    );
  }

  // 5. Precompute vectors.
  const prepared: DocumentData[] = documents.map(document => {
    const tf = computeTF(document.tokens);
    const vector = new Map<string, number>();

    for (const [term, frequency] of tf) {
      vector.set(term, frequency * (idf.get(term) || 1));
    }

    return {
      post: document.post,
      titleTokens: new Set(tokenize(document.post.title || "")),
      keywordTokens: getKeywords(document.post),
      category: getCategory(document.post),
      vector
    };
  });

  const target = prepared[0];

  // 6. Calculate hybrid recommendation scores.
  const scored: RecommendationScore[] = [];

  for (const candidate of prepared.slice(1)) {
    const contentScore = cosineSimilarity(
      target.vector,
      candidate.vector
    );

    const titleScore = overlapScore(
      target.titleTokens,
      candidate.titleTokens
    );

    const keywordScore = overlapScore(
      target.keywordTokens,
      candidate.keywordTokens
    );

    const categoryScore =
      target.category &&
      candidate.category &&
      target.category === candidate.category
        ? 1
        : 0;

    const score =
      contentScore * 0.50 +
      titleScore * 0.20 +
      keywordScore * 0.20 +
      categoryScore * 0.10;

    scored.push({
      post: candidate.post,
      score
    });
  }

  // 7. Sort by relevance.
  scored.sort((a, b) => b.score - a.score);

  // 8. Prefer relevant recommendations.
  const relevant = scored.filter(item => item.score > 0);

  // 9. Category-based fallback.
  const categoryFallback = scored.filter(
    item =>
      item.score === 0 &&
      getCategory(item.post) === target.category
  );

  // 10. General fallback if needed.
  const generalFallback = scored.filter(
    item => item.score === 0
  );

  return [
    ...relevant,
    ...categoryFallback,
    ...generalFallback
  ]
    .slice(0, safeLimit)
    .map(item => item.post);
}
