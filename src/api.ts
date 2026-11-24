export type SubmitLetterResult = { id: string };

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export async function submitLetter(
  email: string,
  message: string,
): Promise<SubmitLetterResult> {
  if (!API_URL) {
    // Stub until the backend exists. Dev only, so prod fails loudly.
    if (import.meta.env.PROD) throw new Error("VITE_API_URL is not set");
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { id: crypto.randomUUID() };
  }
  const res = await fetch(`${API_URL}/letters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, message }),
  });
  if (!res.ok) throw new Error(`submitLetter failed: ${res.status}`);
  return (await res.json()) as SubmitLetterResult; // expects { id, status: 'pending_review' }
}
