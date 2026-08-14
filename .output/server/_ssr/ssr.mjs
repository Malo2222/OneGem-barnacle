import { n as __exportAll } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as Type, t as GoogleGenAI } from "../_libs/google__genai+p-retry+retry.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll({
	a: () => platformMeta,
	c: () => renderErrorPage,
	default: () => server_default,
	i: () => parseCapture,
	n: () => deepLink,
	o: () => timeAgo,
	r: () => initials,
	s: () => webFallback,
	t: () => PLATFORMS
});
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
function getGeminiClient() {
	const apiKey = processModule.env.GEMINI_API_KEY;
	if (!apiKey) return null;
	return new GoogleGenAI({
		apiKey,
		httpOptions: { headers: { "User-Agent": "aistudio-build" } }
	});
}
async function parseTextOrImageWithGemini(text, imageDataUrl) {
	const ai = getGeminiClient();
	if (!ai) return null;
	try {
		const parts = [];
		if (imageDataUrl) {
			const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
			if (match) parts.push({ inlineData: {
				mimeType: match[1],
				data: match[2]
			} });
		}
		const promptText = `Analyze this social notification, screenshot, or raw pasted message text from a phone/email.
Extract:
1. Sender's display name or handle (e.g. "Chloe", "@chloe_x", "John Smith").
2. Clean message body text.
3. Platform: one of ["imessage", "sms", "instagram", "snapchat", "email"].
4. Any candidate handles found (e.g., email address, instagram handle, phone number).

${text ? `Raw Text:\n"${text}"` : "Extract text from image."}`;
		parts.push({ text: promptText });
		const response = await ai.models.generateContent({
			model: "gemini-3.6-flash",
			contents: { parts },
			config: {
				systemInstruction: "You are Gem's precision AI notification parser. Extract structured contact & message details accurately.",
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						sender: {
							type: Type.STRING,
							description: "Name or handle of sender"
						},
						body: {
							type: Type.STRING,
							description: "Extracted message body content"
						},
						platform: {
							type: Type.STRING,
							description: "Detected platform: imessage, sms, instagram, snapchat, or email"
						},
						confidence: {
							type: Type.NUMBER,
							description: "Confidence score between 0 and 1"
						},
						extractedHandles: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									platform: { type: Type.STRING },
									value: { type: Type.STRING }
								}
							}
						}
					},
					required: [
						"sender",
						"body",
						"platform"
					]
				}
			}
		});
		if (response.text) {
			const parsed = JSON.parse(response.text.trim());
			if (![
				"imessage",
				"sms",
				"instagram",
				"snapchat",
				"email"
			].includes(parsed.platform)) parsed.platform = "sms";
			return parsed;
		}
	} catch (err) {
		console.error("Gemini parse error:", err);
	}
	return null;
}
var PLATFORMS = [
	{
		id: "imessage",
		label: "iMessage",
		short: "iM",
		color: "oklch(0.72 0.19 145)"
	},
	{
		id: "sms",
		label: "SMS",
		short: "SMS",
		color: "oklch(0.72 0.15 230)"
	},
	{
		id: "instagram",
		label: "Instagram",
		short: "IG",
		color: "oklch(0.68 0.22 15)"
	},
	{
		id: "snapchat",
		label: "Snapchat",
		short: "SC",
		color: "oklch(0.86 0.17 100)"
	},
	{
		id: "email",
		label: "Email",
		short: "@",
		color: "oklch(0.66 0.13 280)"
	}
];
var platformMeta = (id) => PLATFORMS.find((p) => p.id === id) ?? {
	id,
	label: id,
	short: id.slice(0, 2).toUpperCase(),
	color: "oklch(0.6 0.05 300)"
};
/** Deep links never send anything on their own — they only open the chat. */
function deepLink(platform, value) {
	const v = value.trim();
	switch (platform) {
		case "imessage":
		case "sms": return `sms:${v.replace(/[^\d+]/g, "")}`;
		case "instagram": return `instagram://user?username=${encodeURIComponent(v.replace(/^@/, ""))}`;
		case "snapchat": return `snapchat://add/${encodeURIComponent(v.replace(/^@/, ""))}`;
		case "email": return `mailto:${v}`;
		default: return "#";
	}
}
function webFallback(platform, value) {
	const v = value.trim().replace(/^@/, "");
	if (platform === "instagram") return `https://instagram.com/${v}`;
	if (platform === "snapchat") return `https://www.snapchat.com/add/${v}`;
	return null;
}
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "now";
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d`;
	return new Date(iso).toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	});
}
/**
* Parses pasted notification text into { sender, body, platform }.
* Handles the common iOS notification shapes:
*   "Instagram\nChloe: hey are you up"
*   "Chloe sent you a snap"
*   "Chloe: hey"
*/
function parseCapture(raw) {
	const text = raw.trim();
	const lower = text.toLowerCase();
	let platform = "sms";
	if (lower.includes("instagram")) platform = "instagram";
	else if (lower.includes("snapchat") || lower.includes("snap")) platform = "snapchat";
	else if (lower.includes("imessage")) platform = "imessage";
	else if (lower.includes("mail") || /\S+@\S+\.\S+/.test(text)) platform = "email";
	const lines = text.split("\n").map((l) => l.trim()).filter(Boolean).filter((l) => !/^(instagram|snapchat|messages|imessage|mail|gmail|now|\d+m ago)$/i.test(l));
	const joined = lines.join("\n");
	const colon = joined.match(/^([^:\n]{1,40}):\s*([\s\S]+)$/);
	if (colon) return {
		sender: colon[1].trim(),
		body: colon[2].trim(),
		platform
	};
	const snap = joined.match(/^(.{1,40}?)\s+(sent you a snap|sent you a chat|sent a message)/i);
	if (snap) return {
		sender: snap[1].trim(),
		body: joined,
		platform: "snapchat"
	};
	if (lines.length > 1) return {
		sender: lines[0],
		body: lines.slice(1).join("\n"),
		platform
	};
	return {
		sender: "",
		body: joined,
		platform
	};
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-BorShNiI.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var SUPABASE_URL = processModule.env.VITE_SUPABASE_URL || processModule.env.SUPABASE_URL || "https://zqwwgcfahfzckmapilhs.supabase.co";
var SUPABASE_KEY = processModule.env.SUPABASE_SERVICE_ROLE_KEY || processModule.env.VITE_SUPABASE_PUBLISHABLE_KEY || processModule.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_IIBKeW7ACXK4_EnM57Pl7A_j3VvTeUh";
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
var corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
	"Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
	"Access-Control-Max-Age": "86400"
};
var server_default = { async fetch(request, env, ctx) {
	const url = new URL(request.url);
	if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) return new Response(null, {
		status: 204,
		headers: corsHeaders
	});
	if (url.pathname === "/api/gemini/parse-capture" && request.method === "POST") try {
		const body = await request.json().catch(() => ({}));
		const result = await parseTextOrImageWithGemini(body.text, body.imageDataUrl);
		return new Response(JSON.stringify(result ?? { error: "Failed to parse" }), {
			status: result ? 200 : 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json"
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json"
			}
		});
	}
	if ((url.pathname === "/api/public/ingest" || url.pathname === "/api/ingest") && (request.method === "POST" || request.method === "GET")) try {
		let payload = {};
		if (request.method === "GET") payload = Object.fromEntries(url.searchParams.entries());
		else {
			const contentType = request.headers.get("content-type") ?? "";
			if (contentType.includes("application/json")) payload = await request.json().catch(() => ({}));
			else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
				const formData = await request.formData().catch(() => new FormData());
				payload = Object.fromEntries(formData.entries());
			} else {
				const text = await request.text().catch(() => "");
				try {
					payload = JSON.parse(text);
				} catch {
					payload = { raw: text };
				}
			}
		}
		let sender = String(payload.sender ?? payload.name ?? payload.from ?? payload.contact ?? "").trim();
		let body = String(payload.body ?? payload.text ?? payload.message ?? payload.content ?? payload.raw ?? "").trim();
		let platform = String(payload.platform ?? payload.app ?? payload.service ?? "sms").toLowerCase().trim();
		if (!body && !sender) return new Response(JSON.stringify({ error: "Missing message body or sender parameters" }), {
			status: 400,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json"
			}
		});
		if ((!sender || sender.toLowerCase() === "unknown") && body) {
			const parsed = parseCapture(body);
			if (parsed.sender) sender = parsed.sender;
			if (parsed.body) body = parsed.body;
			if (parsed.platform) platform = parsed.platform;
		}
		if (!sender) sender = "Unknown Contact";
		if (!platform) platform = "sms";
		let userId = null;
		const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
		if (profiles && profiles.length > 0) userId = profiles[0].id;
		else {
			const { data: contacts } = await supabase.from("contacts").select("user_id").not("user_id", "is", null).limit(1);
			if (contacts && contacts.length > 0) userId = contacts[0].user_id;
		}
		let contactId = null;
		if (userId) {
			const { data: existing } = await supabase.from("contacts").select("id, display_name").eq("user_id", userId);
			if (existing) {
				const match = existing.find((c) => c.display_name.trim().toLowerCase() === sender.trim().toLowerCase());
				if (match) contactId = match.id;
			}
			if (!contactId) {
				const { data: newContact } = await supabase.from("contacts").insert({
					user_id: userId,
					display_name: sender
				}).select("id").single();
				if (newContact) contactId = newContact.id;
			}
			if (contactId) await supabase.from("messages").insert({
				user_id: userId,
				contact_id: contactId,
				platform,
				direction: "incoming",
				body,
				read: false
			});
		}
		return new Response(JSON.stringify({
			status: "ok",
			message: "Message ingested and synced to inbox",
			parsed: {
				sender,
				body,
				platform,
				contactId
			}
		}), {
			status: 200,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json"
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Ingest failed" }), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json"
			}
		});
	}
	try {
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { platformMeta as a, renderErrorPage as c, server_default as default, parseCapture as i, ssr_exports as l, deepLink as n, timeAgo as o, initials as r, webFallback as s, PLATFORMS as t };
