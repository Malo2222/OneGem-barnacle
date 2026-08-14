import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { matchContact, parseCapture } from "@/lib/gem";

export const Route = createFileRoute("/api/public/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Partial<{
            device_key?: string;
            text?: string;
            sender?: string;
            platform?: string;
          }>;

          const deviceKey = (body.device_key ?? "").trim();
          const rawText = (body.text ?? "").trim();
          if (!deviceKey || !rawText) {
            return Response.json({ error: "device_key and text are required" }, { status: 400 });
          }

          const { data: device, error: deviceError } = await supabaseAdmin
            .from("device_tokens")
            .select("user_id, active")
            .eq("token", deviceKey)
            .eq("active", true)
            .maybeSingle();

          if (deviceError || !device) {
            return Response.json({ error: "invalid device key" }, { status: 401 });
          }

          const parsed = parseCapture(rawText);
          const userId = device.user_id;

          const [{ data: contacts = [] }, { data: handles = [] }] = await Promise.all([
            supabaseAdmin
              .from("contacts")
              .select("id, display_name, avatar_url, accent, pinned, position, notes")
              .eq("user_id", userId),
            supabaseAdmin
              .from("handles")
              .select("id, contact_id, platform, value, label")
              .eq("user_id", userId),
          ]);

          let matchedContactId: string | null = null;
          let contact = matchContact(parsed.sender || "", parsed.platform, contacts as any, handles as any);

          if (contact) {
            matchedContactId = contact.id;
          } else {
            const name = (parsed.sender || "Unknown").trim() || "Unknown";
            const { data: newContact, error: createContactError } = await supabaseAdmin
              .from("contacts")
              .insert({
                user_id: userId,
                display_name: name,
                position: (contacts?.length ?? 0) + 1,
              })
              .select("id")
              .single();

            if (createContactError || !newContact) {
              throw createContactError ?? new Error("could not create contact");
            }

            matchedContactId = newContact.id;
            if (parsed.sender) {
              await supabaseAdmin.from("handles").insert({
                user_id: userId,
                contact_id: matchedContactId,
                platform: parsed.platform,
                value: parsed.sender,
              });
            }
          }

          if (!matchedContactId) {
            return Response.json({ error: "no contact match" }, { status: 400 });
          }

          const handle = handles.find(
            (h) => h.contact_id === matchedContactId && h.platform === parsed.platform,
          );

          const { error: messageError } = await supabaseAdmin.from("messages").insert({
            user_id: userId,
            contact_id: matchedContactId,
            handle_id: handle?.id ?? null,
            platform: parsed.platform,
            direction: "incoming",
            body: parsed.body || rawText,
            raw: rawText,
            read: false,
          });

          if (messageError) {
            throw messageError;
          }

          return Response.json({
            ok: true,
            contact_id: matchedContactId,
            platform: parsed.platform,
            sender: parsed.sender || null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown error";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
