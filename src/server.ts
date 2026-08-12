import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

import { parseTextOrImageWithGemini } from "./lib/gemini-server";
import { parseCapture } from "./lib/gem";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://zqwwgcfahfzckmapilhs.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_IIBKeW7ACXK4_EnM57Pl7A_j3VvTeUh";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Handle CORS Preflight for any API route
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // API Route: Server-side Gemini OCR / AI Notification Parser
    if (
      url.pathname === "/api/gemini/parse-capture" &&
      request.method === "POST"
    ) {
      try {
        const body = (await request.json().catch(() => ({}))) as {
          text?: string;
          imageDataUrl?: string;
        };
        const result = await parseTextOrImageWithGemini(
          body.text,
          body.imageDataUrl,
        );
        return new Response(
          JSON.stringify(result ?? { error: "Failed to parse" }),
          {
            status: result ? 200 : 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: err instanceof Error ? err.message : "Internal error",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // API Route: Mac SMSBridge / Notification / Email / IG / Snap Ingest API
    if (
      (url.pathname === "/api/public/ingest" ||
        url.pathname === "/api/ingest") &&
      (request.method === "POST" || request.method === "GET")
    ) {
      try {
        let payload: Record<string, unknown> = {};

        if (request.method === "GET") {
          payload = Object.fromEntries(url.searchParams.entries());
        } else {
          const contentType = request.headers.get("content-type") ?? "";
          if (contentType.includes("application/json")) {
            payload = (await request.json().catch(() => ({}))) as Record<
              string,
              unknown
            >;
          } else if (
            contentType.includes("application/x-www-form-urlencoded") ||
            contentType.includes("multipart/form-data")
          ) {
            const formData = await request
              .formData()
              .catch(() => new FormData());
            payload = Object.fromEntries(formData.entries());
          } else {
            const text = await request.text().catch(() => "");
            try {
              payload = JSON.parse(text) as Record<string, unknown>;
            } catch {
              payload = { raw: text };
            }
          }
        }

        let sender = String(
          payload.sender ??
            payload.name ??
            payload.from ??
            payload.contact ??
            "",
        ).trim();
        let body = String(
          payload.body ??
            payload.text ??
            payload.message ??
            payload.content ??
            payload.raw ??
            "",
        ).trim();
        let platform = String(
          payload.platform ?? payload.app ?? payload.service ?? "sms",
        )
          .toLowerCase()
          .trim();

        if (!body && !sender) {
          return new Response(
            JSON.stringify({
              error: "Missing message body or sender parameters",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // If body contains notification format e.g. "Chloe: Hey what's up" or "Instagram: Chloe sent a message"
        if ((!sender || sender.toLowerCase() === "unknown") && body) {
          const parsed = parseCapture(body);
          if (parsed.sender) sender = parsed.sender;
          if (parsed.body) body = parsed.body;
          if (parsed.platform) platform = parsed.platform;
        }

        if (!sender) sender = "Unknown Contact";
        if (!platform) platform = "sms";

        // Find primary user_id
        let userId: string | null = null;
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id")
          .limit(1);
        if (profiles && profiles.length > 0) {
          userId = profiles[0].id;
        } else {
          const { data: contacts } = await supabase
            .from("contacts")
            .select("user_id")
            .not("user_id", "is", null)
            .limit(1);
          if (contacts && contacts.length > 0) {
            userId = contacts[0].user_id;
          }
        }

        let contactId: string | null = null;
        if (userId) {
          // Find existing contact by name
          const { data: existing } = await supabase
            .from("contacts")
            .select("id, display_name")
            .eq("user_id", userId);

          if (existing) {
            const match = existing.find(
              (c) =>
                c.display_name.trim().toLowerCase() ===
                sender.trim().toLowerCase(),
            );
            if (match) contactId = match.id;
          }

          if (!contactId) {
            const { data: newContact } = await supabase
              .from("contacts")
              .insert({ user_id: userId, display_name: sender })
              .select("id")
              .single();
            if (newContact) contactId = newContact.id;
          }

          if (contactId) {
            await supabase.from("messages").insert({
              user_id: userId,
              contact_id: contactId,
              platform,
              direction: "incoming",
              body,
              read: false,
            });
          }
        }

        return new Response(
          JSON.stringify({
            status: "ok",
            message: "Message ingested and synced to inbox",
            parsed: {
              sender,
              body,
              platform,
              contactId,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: err instanceof Error ? err.message : "Ingest failed",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
