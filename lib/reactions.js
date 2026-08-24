// Single source of truth for reactions across the app.
// Adding/removing an emoji or changing its weight only needs to happen here.

// Positive emoji push a post up in "Top", 👎 pulls it down.
// Weight 0 means it still counts as engagement but doesn't affect ranking.
const REACTION_WEIGHTS = {
  "🔥": 2,
  "❤️": 2,
  "😂": 1,
  "😮": 1,
  "😢": 0,
  "👀": 0,
  "👎": -1,
};

const REACTION_EMOJIS = Object.keys(REACTION_WEIGHTS);

function scoreReactions(reactions) {
  return reactions.reduce((sum, r) => sum + (REACTION_WEIGHTS[r.emoji] || 0), 0);
}

module.exports = { REACTION_WEIGHTS, REACTION_EMOJIS, scoreReactions };