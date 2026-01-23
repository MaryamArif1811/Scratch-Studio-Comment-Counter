async function getAllComments(studioId) {
  let total = 0;
  let offset = 0;

  while (true) {
    const url = `https://api.scratch.mit.edu/studios/${studioId}/comments?offset=${offset}&limit=40`;
    const res = await fetch(url);

    if (!res.ok) break;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    total += data.length;

    for (const comment of data) {
      if (comment.reply_count) {
        total += comment.reply_count;
      }
    }

    offset += 40;
    if (offset > 10000) break;
  }

  return total;
}

async function handleSubmit() {
  const studioId = document.getElementById("studioId").value;
  const output = document.getElementById("output");

  output.textContent = "Counting comments...";

  try {
    const total = await getAllComments(studioId);
    output.textContent = `Total comments (including replies): ${total}`;
  } catch (e) {
    output.textContent = "Error fetching comments.";
  }
}
