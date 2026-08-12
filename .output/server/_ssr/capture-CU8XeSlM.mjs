import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { d as useSaveHandle, i as useContacts, p as useUserId, r as useAddMessage, s as useHandles, t as cn, u as useSaveContact } from "./utils-YPEVRlR0.mjs";
import { t as Button } from "./button-CkJpu_RW.mjs";
import { t as Input } from "./input-D_-8VJDx.mjs";
import { t as Label } from "./label-2DlErg4a.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as parseCapture, t as PLATFORMS } from "./ssr.mjs";
import { P as ClipboardPaste, R as Camera, T as LoaderCircle, d as Sparkle, o as Upload } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-BGv4OLxh.mjs";
import { t as PlatformBadge } from "./PlatformBadge-diAC2Db9.mjs";
import { t as Textarea } from "./textarea-DL7jnpBy.mjs";
import { t as isAlikeName } from "./contact-sync-C_OLyObS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/capture-CU8XeSlM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Capture() {
	const [raw, setRaw] = (0, import_react.useState)("");
	const [sender, setSender] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [platform, setPlatform] = (0, import_react.useState)("sms");
	const [contactId, setContactId] = (0, import_react.useState)("");
	const [imagePreview, setImagePreview] = (0, import_react.useState)(null);
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const { data: contacts = [] } = useContacts();
	const { data: handles = [] } = useHandles();
	const saveContact = useSaveContact();
	const saveHandle = useSaveHandle();
	const addMessage = useAddMessage();
	const userId = useUserId();
	const navigate = useNavigate();
	const parsed = (0, import_react.useMemo)(() => raw ? parseCapture(raw) : null, [raw]);
	(0, import_react.useEffect)(() => {
		if (!parsed) return;
		if (parsed.sender) setSender(parsed.sender);
		if (parsed.body) setBody(parsed.body);
		if (parsed.platform) setPlatform(parsed.platform);
		const guess = contacts.find((c) => isAlikeName(c.display_name, parsed.sender)) ?? contacts.find((c) => handles.some((h) => h.contact_id === c.id && h.value.replace(/^@/, "").toLowerCase() === parsed.sender.trim().replace(/^@/, "").toLowerCase()));
		setContactId(guess?.id ?? "");
	}, [
		parsed?.sender,
		parsed?.body,
		parsed?.platform
	]);
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
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsScanning(true);
		const reader = new FileReader();
		reader.onload = async (event) => {
			const dataUrl = event.target?.result;
			setImagePreview(dataUrl);
			try {
				const res = await fetch("/api/gemini/parse-capture", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ imageDataUrl: dataUrl })
				});
				if (res.ok) {
					const result = await res.json();
					if (result.sender) setSender(result.sender);
					if (result.body) setBody(result.body);
					if (result.platform) setPlatform(result.platform);
					const guess = contacts.find((c) => isAlikeName(c.display_name, result.sender));
					setContactId(guess?.id ?? "");
					toast.success("Screenshot OCR parsed by Gemini");
				} else toast.error("Failed to parse image with AI");
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
					position: contacts.length
				});
				if (sender.trim()) await saveHandle.mutateAsync({
					user_id: userId,
					contact_id: targetId,
					platform,
					value: sender.trim()
				}).catch(() => void 0);
			}
			const handle = handles.find((h) => h.contact_id === targetId && h.platform === platform);
			await addMessage.mutateAsync({
				user_id: userId,
				contact_id: targetId,
				handle_id: handle?.id ?? null,
				platform,
				direction: "incoming",
				body: body.trim(),
				raw: raw || "[Screenshot Captured]"
			});
			toast.success("Filed in Gem");
			setRaw("");
			setBody("");
			setSender("");
			setImagePreview(null);
			navigate({
				to: "/thread/$contactId",
				params: { contactId: targetId }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Capture",
		subtitle: "Paste text or drop screenshots, Gem sorts it",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gem-surface rounded-[1.6rem] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex items-center gap-1.5 font-semibold text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-gold" }), " Image / Screenshot OCR"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => fileInputRef.current?.click(),
								disabled: isScanning,
								className: "h-8 gap-1.5 rounded-full text-xs",
								children: [isScanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Upload Screenshot"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: "image/*",
								onChange: handleFileUpload,
								className: "hidden"
							})
						]
					}),
					imagePreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-2 overflow-hidden rounded-2xl border border-primary/30 max-h-48 bg-black/40 flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: imagePreview,
							alt: "Screenshot",
							className: "max-h-48 object-contain"
						}), isScanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-xs font-semibold text-white gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-gold" }), "Extracting text with AI..."]
						}) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "raw",
							className: "text-xs text-muted-foreground",
							children: "Or paste notification text"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: pasteFromClipboard,
							className: "h-7 gap-1 rounded-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-3" }), " Paste"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "raw",
						value: raw,
						onChange: (e) => setRaw(e.target.value),
						rows: 3,
						placeholder: "Instagram\nChloe: hey are you up?",
						className: "resize-none rounded-2xl border-border bg-surface-2 text-sm"
					}),
					parsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, { className: "size-3 text-gold" }),
							" Detected",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
								platform: parsed.platform,
								size: "xs"
							}),
							parsed.sender ? `from ${parsed.sender}` : "— set sender below"
						]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gem-surface space-y-4 rounded-[1.6rem] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPlatform(p.id),
								className: cn("rounded-full border px-3 py-1.5 text-xs transition-all active:scale-95", platform === p.id ? "border-transparent gem-brand text-primary-foreground shadow-md font-semibold" : "border-border bg-surface-2 text-muted-foreground"),
								children: p.label
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contact",
							children: "Target Contact (Auto-merged)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "contact",
							value: contactId,
							onChange: (e) => setContactId(e.target.value),
							className: "h-11 w-full rounded-2xl border border-border bg-surface-2 px-3 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "➕ Create new person…"
							}), contacts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.display_name
							}, c.id))]
						})]
					}),
					!contactId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sender",
							children: "Person Name / Handle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sender",
							value: sender,
							onChange: (e) => setSender(e.target.value),
							placeholder: "Chloe",
							className: "h-11 rounded-2xl bg-surface-2"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "body",
							children: "Message Body"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "body",
							value: body,
							onChange: (e) => setBody(e.target.value),
							rows: 3,
							className: "resize-none rounded-2xl border-border bg-surface-2 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						className: "gem-brand h-12 w-full rounded-2xl font-semibold text-primary-foreground transition-transform active:scale-[0.98] shadow-lg",
						children: "File in Unified Gem Inbox"
					})
				]
			})]
		})
	});
}
//#endregion
export { Capture as component };
