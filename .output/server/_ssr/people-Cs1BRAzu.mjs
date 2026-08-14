import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as useDeleteContact, d as useSaveHandle, i as useContacts, o as useDeleteHandle, p as useUserId, s as useHandles, t as cn, u as useSaveContact } from "./utils-YPEVRlR0.mjs";
import { t as Button } from "./button-CkJpu_RW.mjs";
import { t as Input } from "./input-D_-8VJDx.mjs";
import { t as Label } from "./label-2DlErg4a.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as initials, t as PLATFORMS } from "./ssr.mjs";
import { a as UserCheck, j as Download, r as X, s as Trash2, u as Sparkles, v as Plus, y as Pin } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-BGv4OLxh.mjs";
import { t as PlatformBadge } from "./PlatformBadge-diAC2Db9.mjs";
import { n as parseVCard, r as pickDeviceContacts, t as isAlikeName } from "./contact-sync-C_OLyObS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-Cs1BRAzu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function People() {
	const { data: contacts = [] } = useContacts();
	const { data: handles = [] } = useHandles();
	const saveContact = useSaveContact();
	const deleteContact = useDeleteContact();
	const saveHandle = useSaveHandle();
	const deleteHandle = useDeleteHandle();
	const userId = useUserId();
	const [name, setName] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(null);
	const [platform, setPlatform] = (0, import_react.useState)("imessage");
	const [value, setValue] = (0, import_react.useState)("");
	const [label, setLabel] = (0, import_react.useState)("");
	const vcardInputRef = (0, import_react.useRef)(null);
	const addPerson = async () => {
		if (!userId || !name.trim()) return;
		await saveContact.mutateAsync({
			user_id: userId,
			display_name: name.trim(),
			position: contacts.length
		});
		setName("");
		toast.success("Person added");
	};
	const handleDeviceImport = async () => {
		if (!userId) return;
		const deviceContacts = await pickDeviceContacts();
		if (!deviceContacts.length) {
			toast.message("No contacts selected or browser contacts picker unsupported");
			return;
		}
		let count = 0;
		for (const dc of deviceContacts) {
			let cId = contacts.find((c) => isAlikeName(c.display_name, dc.displayName))?.id;
			if (!cId) cId = await saveContact.mutateAsync({
				user_id: userId,
				display_name: dc.displayName,
				position: contacts.length + count
			});
			for (const phone of dc.phoneNumbers) await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: cId,
				platform: "sms",
				value: phone
			}).catch(() => void 0);
			for (const email of dc.emails) await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: cId,
				platform: "email",
				value: email
			}).catch(() => void 0);
			count++;
		}
		toast.success(`Imported & merged ${count} contacts from device`);
	};
	const handleVCardFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file || !userId) return;
		const text = await file.text();
		const parsedCards = parseVCard(text);
		if (!parsedCards.length) {
			toast.error("Could not parse vCard contacts");
			return;
		}
		let count = 0;
		for (const card of parsedCards) {
			let cId = contacts.find((c) => isAlikeName(c.display_name, card.displayName))?.id;
			if (!cId) cId = await saveContact.mutateAsync({
				user_id: userId,
				display_name: card.displayName,
				position: contacts.length + count
			});
			for (const phone of card.phoneNumbers) await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: cId,
				platform: "sms",
				value: phone
			}).catch(() => void 0);
			for (const email of card.emails) await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: cId,
				platform: "email",
				value: email
			}).catch(() => void 0);
			for (const soc of card.socialHandles) await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: cId,
				platform: soc.platform,
				value: soc.value
			}).catch(() => void 0);
			count++;
		}
		toast.success(`Merged ${count} contacts from vCard file`);
	};
	const addHandle = async (contactId) => {
		if (!userId || !value.trim()) return;
		try {
			await saveHandle.mutateAsync({
				user_id: userId,
				contact_id: contactId,
				platform,
				value: value.trim(),
				label: label.trim() || null
			});
			setValue("");
			setLabel("");
		} catch {
			toast.error("That handle already exists");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "People",
		subtitle: "One person, every account",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gem-surface rounded-[1.6rem] p-3.5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-semibold text-gold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Automatic Identity Merge"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleDeviceImport,
								className: "h-8 rounded-full text-xs gap-1.5 border-primary/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-primary" }), " Phone Contacts"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => vcardInputRef.current?.click(),
								className: "h-8 rounded-full text-xs gap-1.5 border-primary/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-primary" }), " Import .VCF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: vcardInputRef,
								type: "file",
								accept: ".vcf,text/vcard",
								onChange: handleVCardFileUpload,
								className: "hidden"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Add person manually (e.g. Chloe)",
						className: "h-11 rounded-2xl border-border bg-surface-2 text-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: addPerson,
						"aria-label": "Add person",
						className: "gem-brand size-11 shrink-0 rounded-full p-0 text-primary-foreground shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})]
			}), contacts.map((c) => {
				const own = handles.filter((h) => h.contact_id === c.id);
				const expanded = open === c.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gem-surface rounded-[1.6rem] p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-primary-foreground",
								style: { backgroundImage: c.accent ? `linear-gradient(135deg, ${c.accent}, var(--gold))` : "var(--gradient-brand)" },
								children: c.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.avatar_url,
									alt: c.display_name,
									loading: "lazy",
									className: "size-full object-cover"
								}) : initials(c.display_name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpen(expanded ? null : c.id),
								className: "min-w-0 flex-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: c.display_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 flex flex-wrap gap-1",
									children: own.length ? own.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
										platform: h.platform,
										size: "xs"
									}, h.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "No handles yet"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Pin",
								onClick: () => userId && saveContact.mutate({
									id: c.id,
									user_id: userId,
									display_name: c.display_name,
									pinned: !c.pinned
								}),
								className: cn("flex size-9 items-center justify-center rounded-full border border-border", c.pinned ? "text-gold" : "text-muted-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
									className: "size-4",
									fill: c.pinned ? "currentColor" : "none"
								})
							})
						]
					}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3 border-t border-border pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photo URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									defaultValue: c.avatar_url ?? "",
									onBlur: (e) => userId && saveContact.mutate({
										id: c.id,
										user_id: userId,
										display_name: c.display_name,
										avatar_url: e.target.value || null
									}),
									placeholder: "https://…",
									className: "h-10 rounded-xl bg-surface-2 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Accent colour" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "color",
									defaultValue: c.accent ?? "#8b5cf6",
									onBlur: (e) => userId && saveContact.mutate({
										id: c.id,
										user_id: userId,
										display_name: c.display_name,
										accent: e.target.value
									}),
									className: "h-10 w-20 rounded-xl bg-surface-2 p-1"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: own.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
											platform: h.platform,
											size: "xs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate",
											children: h.value
										}),
										h.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: h.label
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Remove handle",
											onClick: () => deleteHandle.mutate(h.id),
											className: "text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
										})
									]
								}, h.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-2xl border border-dashed border-border p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setPlatform(p.id),
											className: cn("rounded-full border px-2.5 py-1 text-[11px] transition-all active:scale-95", platform === p.id ? "border-transparent gem-brand text-primary-foreground" : "border-border text-muted-foreground"),
											children: p.label
										}, p.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value,
										onChange: (e) => setValue(e.target.value),
										placeholder: platform === "imessage" || platform === "sms" ? "+15551234567" : platform === "email" ? "name@school.edu" : "@username",
										className: "h-10 rounded-xl bg-surface-2 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: label,
										onChange: (e) => setLabel(e.target.value),
										placeholder: "Label (optional) — e.g. second account",
										className: "h-10 rounded-xl bg-surface-2 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => addHandle(c.id),
										className: "gem-brand h-10 w-full rounded-xl text-sm font-semibold text-primary-foreground",
										children: "Add handle"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: () => deleteContact.mutate(c.id),
								className: "h-9 w-full gap-1.5 rounded-xl text-xs text-destructive",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }),
									" Delete ",
									c.display_name
								]
							})
						]
					}) : null]
				}, c.id);
			})]
		})
	});
}
//#endregion
export { People as component };
