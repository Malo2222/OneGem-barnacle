import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ClipboardPaste,
  Sparkle,
  Camera,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useAddMessage,
  useContacts,
  useHandles,
  useSaveContact,
  useSaveHandle,
  useUserId,
} from "@/hooks/useGem";
import { PLATFORMS, parseCapture, type Platform } from "@/lib/gem";
import { isAlikeName } from "@/lib/contact-sync";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Capture a message — Gem" },
      {
        name: "description",
        content:
          "Paste notification text, upload screenshots, or drop images. Gem parses messages and merges contacts automatically.",
      },
      { property: "og:title", content: "Capture a message — Gem" },
      {
        property: "og:description",
        content:
          "Paste notification text or drop screenshots for Gem AI auto-filing.",
      },
    ],
  }),
  component: Capture,
});

function Capture() {
  const [raw, setRaw] = useState("");
  const [sender, setSender] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<Platform>("sms");
  const [contactId, setContactId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: contacts = [] } = useContacts();
  const { data: handles = [] } = useHandles();
  const saveContact = useSaveContact();
  const saveHandle = useSaveHandle();
  const addMessage = useAddMessage();
  const userId = useUserId();
  const navigate = useNavigate();

  const parsed = useMemo(() => (raw ? parseCapture(raw) : null), [raw]);

  useEffect(() => {
    if (!parsed) return;
    if (parsed.sender) setSender(parsed.sender);
    if (parsed.body) setBody(parsed.body);
    if (parsed.platform) setPlatform(parsed.platform);

    // Auto identity merge guess ("everyone with an alike name under their name")
    const guess =
      contacts.find((c) => isAlikeName(c.display_name, parsed.sender)) ??
      contacts.find((c) =>
        handles.some(
          (h) =>
            h.contact_id === c.id &&
            h.value.replace(/^@/, "").toLowerCase() ===
              parsed.sender.trim().replace(/^@/, "").toLowerCase(),
        ),
      );
    setContactId(guess?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.sender, parsed?.body, parsed?.platform]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) throw new Error("empty");
      setRaw(text);
      toast.success("Text pasted into capture");
    } catch {
      toast.message("Clipboard blocked — paste into the box manually.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      try {
        // Send image to Gemini OCR / AI notification parser
        const res = await fetch("/api/gemini/parse-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl: dataUrl }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.sender) setSender(result.sender);
          if (result.body) setBody(result.body);
          if (result.platform) setPlatform(result.platform);

          const guess = contacts.find((c) =>
            isAlikeName(c.display_name, result.sender),
          );
          setContactId(guess?.id ?? "");
          toast.success("Screenshot OCR parsed by Gemini");
        } else {
          toast.error("Failed to parse image with AI");
        }
      } catch (err) {
        toast.error("Error running screenshot OCR");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!userId) return;
    if (!body.trim()) {
      toast.error("Nothing to save yet");
      return;
    }
    try {
      let targetId = contactId;
      if (!targetId) {
        const name = sender.trim() || "Unknown";
        targetId = await saveContact.mutateAsync({
          user_id: userId,
          display_name: name,
          position: contacts.length,
        });
        if (sender.trim()) {
          await saveHandle
            .mutateAsync({
              user_id: userId,
              contact_id: targetId,
              platform,
              value: sender.trim(),
            })
            .catch(() => undefined);
        }
      }
      const handle = handles.find(
        (h) => h.contact_id === targetId && h.platform === platform,
      );
      await addMessage.mutateAsync({
        user_id: userId,
        contact_id: targetId,
        handle_id: handle?.id ?? null,
        platform,
        direction: "incoming",
        body: body.trim(),
        raw: raw || "[Screenshot Captured]",
      });
      toast.success("Filed in Gem");
      setRaw("");
      setBody("");
      setSender("");
      setImagePreview(null);
      navigate({ to: "/thread/$contactId", params: { contactId: targetId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  };

  return (
    <AppShell
      title="Capture"
      subtitle="Paste text or drop screenshots, Gem sorts it"
    >
      <div className="mx-auto max-w-md space-y-4">
        {/* Screenshot Upload / OCR Capture Panel */}
        <div className="gem-surface rounded-[1.6rem] p-4">
          <div className="mb-3 flex items-center justify-between">
            <Label className="flex items-center gap-1.5 font-semibold text-sm">
              <Camera className="size-4 text-gold" /> Image / Screenshot OCR
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="h-8 gap-1.5 rounded-full text-xs"
            >
              {isScanning ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              Upload Screenshot
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {imagePreview ? (
            <div className="relative my-2 overflow-hidden rounded-2xl border border-primary/30 max-h-48 bg-black/40 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Screenshot"
                className="max-h-48 object-contain"
              />
              {isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-xs font-semibold text-white gap-2">
                  <Loader2 className="size-4 animate-spin text-gold" />
                  Extracting text with AI...
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 mb-2 flex items-center justify-between">
            <Label htmlFor="raw" className="text-xs text-muted-foreground">
              Or paste notification text
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={pasteFromClipboard}
              className="h-7 gap-1 rounded-full text-xs"
            >
              <ClipboardPaste className="size-3" /> Paste
            </Button>
          </div>
          <Textarea
            id="raw"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            placeholder={"Instagram\nChloe: hey are you up?"}
            className="resize-none rounded-2xl border-border bg-surface-2 text-sm"
          />
          {parsed ? (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkle className="size-3 text-gold" /> Detected{" "}
              <PlatformBadge platform={parsed.platform} size="xs" />
              {parsed.sender ? `from ${parsed.sender}` : "— set sender below"}
            </p>
          ) : null}
        </div>

        {/* Structured Message & Contact Routing Panel */}
        <div className="gem-surface space-y-4 rounded-[1.6rem] p-4">
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-all active:scale-95",
                    platform === p.id
                      ? "border-transparent gem-brand text-primary-foreground shadow-md font-semibold"
                      : "border-border bg-surface-2 text-muted-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact">Target Contact (Auto-merged)</Label>
            <select
              id="contact"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-surface-2 px-3 text-sm font-medium"
            >
              <option value="">➕ Create new person…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </div>

          {!contactId ? (
            <div className="space-y-1.5">
              <Label htmlFor="sender">Person Name / Handle</Label>
              <Input
                id="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Chloe"
                className="h-11 rounded-2xl bg-surface-2"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="body">Message Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="resize-none rounded-2xl border-border bg-surface-2 text-sm"
            />
          </div>

          <Button
            onClick={save}
            className="gem-brand h-12 w-full rounded-2xl font-semibold text-primary-foreground transition-transform active:scale-[0.98] shadow-lg"
          >
            File in Unified Gem Inbox
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
