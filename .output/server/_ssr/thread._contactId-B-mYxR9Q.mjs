import { r as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { c as useMarkRead, i as useContacts, l as useMessages, p as useUserId, r as useAddMessage, s as useHandles, t as cn, u as useSaveContact } from "./utils-YPEVRlR0.mjs";
import { g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as platformMeta, n as deepLink, o as timeAgo, s as webFallback } from "./ssr.mjs";
import { A as ExternalLink, B as BellOff, F as ChevronUp, H as ArrowLeft, I as ChevronDown, N as Clock, O as Flame, h as Send, k as FileText, z as Bell } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-BGv4OLxh.mjs";
import { t as PlatformBadge } from "./PlatformBadge-diAC2Db9.mjs";
import { t as Textarea } from "./textarea-DL7jnpBy.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/thread._contactId-B-mYxR9Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Thread() {
	const { contactId } = useParams({ from: "/thread/$contactId" });
	const { data: contacts = [] } = useContacts();
	const { data: handles = [] } = useHandles();
	const { data: messages = [] } = useMessages(contactId);
	const addMessage = useAddMessage();
	const markRead = useMarkRead();
	const saveContact = useSaveContact();
	const userId = useUserId();
	const contact = contacts.find((c) => c.id === contactId);
	const myHandles = (0, import_react.useMemo)(() => handles.filter((h) => h.contact_id === contactId), [handles, contactId]);
	const [activeHandleId, setActiveHandleId] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)(contact?.notes ?? "");
	const [showNotes, setShowNotes] = (0, import_react.useState)(false);
	const [isSavingNotes, setIsSavingNotes] = (0, import_react.useState)(false);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [showSchedule, setShowSchedule] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (contact?.notes !== void 0) setNotes(contact.notes ?? "");
	}, [contact?.notes]);
	(0, import_react.useEffect)(() => {
		if (!activeHandleId && myHandles[0]) setActiveHandleId(myHandles[0].id);
	}, [myHandles, activeHandleId]);
	(0, import_react.useEffect)(() => {
		if (contactId && messages.some((m) => !m.read && m.direction === "incoming")) markRead.mutate(contactId);
	}, [contactId, messages.length]);
	const activeHandle = myHandles.find((h) => h.id === activeHandleId) ?? null;
	const metrics = (0, import_react.useMemo)(() => {
		const incoming = messages.filter((m) => m.direction === "incoming");
		const outgoing = messages.filter((m) => m.direction === "outgoing");
		const total = messages.length;
		const ratioIn = total > 0 ? Math.round(incoming.length / total * 100) : 50;
		const ratioOut = total > 0 ? 100 - ratioIn : 50;
		const avgInWords = incoming.length > 0 ? Math.round(incoming.reduce((acc, m) => acc + m.body.split(/\s+/).length, 0) / incoming.length) : 0;
		const avgOutWords = outgoing.length > 0 ? Math.round(outgoing.reduce((acc, m) => acc + m.body.split(/\s+/).length, 0) / outgoing.length) : 0;
		let hotStatus = "Equal Balance";
		if (ratioIn > 60) hotStatus = "They text you more";
		else if (ratioOut > 60) hotStatus = "You text them more";
		const lastMsg = [...messages].sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
		let isLateNight = false;
		let lateTimeStr = "";
		if (lastMsg) {
			const d = new Date(lastMsg.sent_at);
			const hrs = d.getHours();
			if (hrs >= 22 || hrs <= 5) {
				isLateNight = true;
				lateTimeStr = d.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				});
			}
		}
		return {
			ratioIn,
			ratioOut,
			avgInWords,
			avgOutWords,
			hotStatus,
			isLateNight,
			lateTimeStr
		};
	}, [messages]);
	const handleSaveNotes = async () => {
		if (!contact || !userId) return;
		setIsSavingNotes(true);
		try {
			await saveContact.mutateAsync({
				id: contact.id,
				user_id: userId,
				display_name: contact.display_name,
				notes
			});
			toast.success("Notes saved for " + contact.display_name);
			setShowNotes(false);
		} catch {
			toast.error("Failed to save notes");
		} finally {
			setIsSavingNotes(false);
		}
	};
	const handoff = async (scheduledTime) => {
		if (!draft.trim() || !activeHandle || !userId) {
			toast.error("Add a handle for this person first");
			return;
		}
		if (scheduledTime) {
			await addMessage.mutateAsync({
				user_id: userId,
				contact_id: contactId,
				handle_id: activeHandle.id,
				platform: activeHandle.platform,
				direction: "outgoing",
				body: `[Scheduled for ${scheduledTime.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})}] ${draft}`,
				read: true,
				sent_at: scheduledTime.toISOString()
			});
			toast.success(`Scheduled text for ${scheduledTime.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})}!`);
			setDraft("");
			setShowSchedule(false);
			return;
		}
		try {
			await navigator.clipboard.writeText(draft);
			toast.success(`Copied — opening ${platformMeta(activeHandle.platform).label}. Paste & send.`);
		} catch {
			toast.message("Copy blocked by the browser — long-press your text to copy.");
		}
		await addMessage.mutateAsync({
			user_id: userId,
			contact_id: contactId,
			handle_id: activeHandle.id,
			platform: activeHandle.platform,
			direction: "outgoing",
			body: draft,
			read: true
		});
		const url = deepLink(activeHandle.platform, activeHandle.value);
		setDraft("");
		window.location.href = url;
		const fallback = webFallback(activeHandle.platform, activeHandle.value);
		if (fallback) setTimeout(() => window.open(fallback, "_blank"), 1200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: contact?.display_name ?? "Conversation",
		subtitle: myHandles.map((h) => platformMeta(h.platform).label).join(" · ") || "No handles yet",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIsMuted(!isMuted),
				"aria-label": "Toggle mute",
				className: cn("flex size-10 items-center justify-center rounded-full border border-border transition-all", isMuted ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-surface-2 text-muted-foreground hover:text-foreground"),
				children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				"aria-label": "Back to inbox",
				className: "flex size-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
			})]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-3 pb-52",
			children: [
				metrics.isLateNight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs text-amber-300 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-amber-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Late night activity (",
							metrics.lateTimeStr,
							") — card subtly shifting to amber tone"
						] })]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gem-surface rounded-3xl p-3.5 space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-gold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" }),
									" Hot Watch Status: ",
									metrics.hotStatus
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowNotes(!showNotes),
								className: "flex items-center gap-1 text-[11px] text-primary hover:underline font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }),
									" Notes & Info",
									" ",
									showNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface-2 p-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-foreground font-bold",
									children: [
										metrics.ratioIn,
										"% Them / ",
										metrics.ratioOut,
										"% You"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px]",
									children: "Message Volume Ratio"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface-2 p-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-foreground font-bold",
									children: [
										"~",
										metrics.avgInWords,
										" words / ~",
										metrics.avgOutWords,
										" words"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px]",
									children: "Avg Text Length"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								height: 0
							},
							animate: {
								opacity: 1,
								height: "auto"
							},
							exit: {
								opacity: 0,
								height: 0
							},
							className: "space-y-2 pt-2 border-t border-border overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-medium text-foreground",
									children: [
										"Notes & Info for ",
										contact?.display_name,
										":"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									placeholder: "Add birthday, Matcha preferences, how you met, key dates...",
									className: "min-h-20 text-xs rounded-xl border-border bg-background"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleSaveNotes,
									disabled: isSavingNotes,
									className: "gem-brand w-full py-1.5 rounded-xl text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all",
									children: isSavingNotes ? "Saving..." : "Save Notes"
								})
							]
						}) : null })
					]
				}),
				messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "gem-surface rounded-3xl p-8 text-center text-sm text-muted-foreground",
					children: [
						"No messages captured for ",
						contact?.display_name ?? "this person",
						" ",
						"yet."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "popLayout",
					children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 10,
							scale: .98
						},
						animate: {
							opacity: 1,
							y: 0,
							scale: 1
						},
						transition: { duration: .2 },
						className: cn("flex", m.direction === "outgoing" ? "justify-end" : "justify-start"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("max-w-[80%] rounded-[1.4rem] px-4 py-2.5 text-sm shadow-[var(--shadow-bubble)]", m.direction === "outgoing" ? "gem-brand text-primary-foreground" : metrics.isLateNight ? "bg-amber-950/40 border border-amber-500/30 text-amber-100" : "gem-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center gap-1.5 opacity-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
									platform: m.platform,
									size: "xs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px]",
									children: timeAgo(m.sent_at)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap break-words",
								children: m.body
							})]
						})
					}, m.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-x-0 bottom-20 z-20 px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gem-surface gem-float mx-auto max-w-md rounded-[1.6rem] p-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [myHandles.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveHandleId(h.id),
								className: cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all active:scale-95", activeHandleId === h.id ? "border-transparent gem-brand text-primary-foreground" : "border-border bg-surface-2 text-muted-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
									platform: h.platform,
									size: "xs"
								}), h.label ?? h.value]
							}, h.id)), myHandles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/people",
								className: "text-[11px] text-primary underline",
								children: "Add a handle for this person"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowSchedule(!showSchedule),
							className: cn("flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-all", showSchedule ? "border-gold text-gold bg-gold/10" : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Schedule"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showSchedule ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							height: 0
						},
						animate: {
							opacity: 1,
							height: "auto"
						},
						exit: {
							opacity: 0,
							height: 0
						},
						className: "flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handoff(new Date(Date.now() + 9e5)),
								className: "rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20",
								children: "+15 Mins"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handoff(new Date(Date.now() + 36e5)),
								className: "rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20",
								children: "+1 Hour"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									const tom = /* @__PURE__ */ new Date();
									tom.setDate(tom.getDate() + 1);
									tom.setHours(9, 0, 0, 0);
									handoff(tom);
								},
								className: "rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20",
								children: "Tomorrow 9 AM"
							})
						]
					}) : null }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							rows: 1,
							placeholder: activeHandle ? `Message ${contact?.display_name ?? ""} on ${platformMeta(activeHandle.platform).label}` : "Add a handle first",
							className: "max-h-32 min-h-11 resize-none rounded-2xl border-border bg-surface-2 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handoff(),
							"aria-label": "Copy and open chat",
							className: "gem-brand flex size-11 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-transform active:scale-95",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" }), " Send copies your text and opens the real chat — nothing is posted for you."]
					})
				]
			})
		})]
	});
}
//#endregion
export { Thread as component };
