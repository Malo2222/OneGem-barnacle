import { r as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as useContacts, l as useMessages, p as useUserId, s as useHandles, t as cn, u as useSaveContact } from "./utils-YPEVRlR0.mjs";
import { t as Input } from "./input-D_-8VJDx.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as timeAgo, r as initials } from "./ssr.mjs";
import { C as MessageCircle, E as List, N as Clock, O as Flame, U as ArrowDown, V as ArrowUp, _ as RotateCcw, b as Network, g as Search, k as FileText, n as ZoomIn, t as ZoomOut, u as Sparkles, x as Move, y as Pin } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-BGv4OLxh.mjs";
import { t as PlatformBadge } from "./PlatformBadge-diAC2Db9.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Db9WIu8n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpatialCanvas({ contacts, handles, messages }) {
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [selectedContactId, setSelectedContactId] = (0, import_react.useState)(null);
	const nodes = (0, import_react.useMemo)(() => {
		const center = {
			x: 340,
			y: 320
		};
		return contacts.map((c, i) => {
			const radius = 120 + i % 3 * 60;
			const angle = 2 * Math.PI * i / (contacts.length || 1);
			const x = center.x + radius * Math.cos(angle);
			const y = center.y + radius * Math.sin(angle);
			const ownHandles = handles.filter((h) => h.contact_id === c.id);
			const ownMessages = messages.filter((m) => m.contact_id === c.id);
			const unreadCount = ownMessages.filter((m) => !m.read && m.direction === "incoming").length;
			const lastMsg = [...ownMessages].sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
			const incomingCount = ownMessages.filter((m) => m.direction === "incoming").length;
			const totalCount = incomingCount + ownMessages.filter((m) => m.direction === "outgoing").length;
			const ratio = totalCount > 0 ? Math.round(incomingCount / totalCount * 100) : 50;
			let hotStatus = "Balanced";
			if (ratio > 60) hotStatus = "They text more";
			else if (ratio < 40) hotStatus = "You text more";
			return {
				contact: c,
				x,
				y,
				handles: ownHandles,
				unreadCount,
				lastMsg,
				ratio,
				hotStatus
			};
		});
	}, [
		contacts,
		handles,
		messages
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[640px] w-full overflow-hidden rounded-3xl border border-primary/20 bg-black/90 gem-blueprint-grid gem-hud-glass select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-full border border-primary/30 bg-surface/80 px-3.5 py-1.5 backdrop-blur-md text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-gold animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] tracking-wider text-primary uppercase flex items-center gap-1.5",
					children: [
						"Free-Float Spatial Space",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "size-3 text-muted-foreground" })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 rounded-full border border-border bg-surface/80 p-1 backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setZoom((z) => Math.min(z + .15, 2)),
						"aria-label": "Zoom in",
						className: "flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setZoom((z) => Math.max(z - .15, .5)),
						"aria-label": "Zoom out",
						className: "flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setZoom(1),
						"aria-label": "Reset view",
						className: "flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative size-full overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				animate: { scale: zoom },
				transition: {
					type: "spring",
					damping: 25,
					stiffness: 200
				},
				className: "relative size-full origin-center min-w-[700px] min-h-[700px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-[340px] top-[320px] -translate-x-1/2 -translate-y-1/2 pointer-events-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-24 rounded-full border border-primary/20 gem-hud-glow animate-ping opacity-20" })
				}), nodes.map(({ contact, x, y, handles: ownHandles, unreadCount, lastMsg, ratio, hotStatus }) => {
					const isSelected = selectedContactId === contact.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						drag: true,
						dragConstraints: {
							left: -250,
							right: 650,
							top: -250,
							bottom: 650
						},
						initial: {
							x,
							y
						},
						animate: { y: [
							y,
							y - 6,
							y
						] },
						transition: { y: {
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut"
						} },
						className: "absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setSelectedContactId(isSelected ? null : contact.id),
							className: "group relative flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex size-14 items-center justify-center rounded-full border-2 border-primary/40 text-sm font-bold text-primary-foreground transition-all duration-300 group-hover:border-gold gem-hud-glow",
									style: { backgroundImage: contact.accent ? `linear-gradient(135deg, ${contact.accent}, var(--gold))` : "var(--gradient-brand)" },
									children: [
										contact.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: contact.avatar_url,
											alt: contact.display_name,
											className: "size-full rounded-full object-cover"
										}) : initials(contact.display_name),
										unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-extrabold text-white animate-bounce",
											children: unreadCount
										}) : null,
										contact.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "absolute -bottom-1 -right-1 size-3.5 text-gold fill-gold" }) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 w-48 rounded-2xl border border-primary/20 bg-black/85 p-3 text-center backdrop-blur-md shadow-2xl transition-all group-hover:border-primary/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-semibold text-xs text-white block",
											children: contact.display_name
										}),
										contact.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 line-clamp-2 text-[10px] text-gold/90 font-mono flex items-center justify-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-2.5 shrink-0" }),
												" ",
												contact.notes
											]
										}) : null,
										lastMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 line-clamp-1 text-[10px] text-muted-foreground italic",
											children: [
												"\"",
												lastMsg.body,
												"\""
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[10px] text-gray-500",
											children: "No captured texts"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-gold font-mono flex items-center gap-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-2.5" }),
													" ",
													ratio,
													"% Them"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-1",
												children: ownHandles.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
													platform: h.platform,
													size: "xs"
												}, h.id))
											})]
										})
									]
								}),
								isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										scale: .9
									},
									animate: {
										opacity: 1,
										scale: 1
									},
									className: "absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-2xl border border-primary/40 bg-black/95 p-3 text-left text-xs text-white backdrop-blur-xl shadow-2xl z-30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pb-1.5 border-b border-white/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gold",
												children: contact.display_name
											}), lastMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
													" ",
													timeAgo(lastMsg.sent_at)
												]
											}) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "my-2 space-y-1 text-[10px] text-gray-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Status:" }),
												" ",
												hotStatus
											] }), contact.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-gold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Note:" }),
													" ",
													contact.notes
												]
											}) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/thread/$contactId",
											params: { contactId: contact.id },
											className: "gem-brand flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-3.5" }), " Open Thread & Notes"]
										})
									]
								}) : null
							]
						})
					}, contact.id);
				})]
			})
		})]
	});
}
function Inbox() {
	const [q, setQ] = (0, import_react.useState)("");
	const [viewMode, setViewMode] = (0, import_react.useState)("list");
	const { data: contacts = [], isLoading } = useContacts();
	const { data: handles = [] } = useHandles();
	const { data: messages = [] } = useMessages();
	const saveContact = useSaveContact();
	const userId = useUserId();
	const rows = (0, import_react.useMemo)(() => {
		const byContact = /* @__PURE__ */ new Map();
		for (const m of messages) {
			if (!m.contact_id) continue;
			const entry = byContact.get(m.contact_id) ?? { unread: 0 };
			if (!entry.last || new Date(m.sent_at) > new Date(entry.last.sent_at)) entry.last = m;
			if (!m.read && m.direction === "incoming") entry.unread += 1;
			byContact.set(m.contact_id, entry);
		}
		const term = q.trim().toLowerCase();
		return contacts.map((c) => ({
			contact: c,
			platforms: [...new Set(handles.filter((h) => h.contact_id === c.id).map((h) => h.platform))],
			last: byContact.get(c.id)?.last,
			unread: byContact.get(c.id)?.unread ?? 0
		})).filter(({ contact, platforms, last }) => !term ? true : contact.display_name.toLowerCase().includes(term) || platforms.some((p) => p.includes(term)) || (last?.body ?? "").toLowerCase().includes(term) || handles.filter((h) => h.contact_id === contact.id).some((h) => h.value.toLowerCase().includes(term)));
	}, [
		contacts,
		handles,
		messages,
		q
	]);
	const move = (id, dir) => {
		if (!userId) return;
		const idx = rows.findIndex((r) => r.contact.id === id);
		const target = rows[idx + dir];
		const current = rows[idx];
		if (!target || !current) return;
		saveContact.mutate({
			id: current.contact.id,
			user_id: userId,
			display_name: current.contact.display_name,
			position: target.contact.position + dir
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		subtitle: `${contacts.length} people · ${messages.length} messages`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search people, handles, messages...",
						className: "h-12 rounded-full border-border bg-surface-2 pl-11 text-sm shadow-inner"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center rounded-full border border-border bg-surface-2 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setViewMode("list"),
						"aria-label": "List view",
						className: cn("flex size-10 items-center justify-center rounded-full text-xs transition-all", viewMode === "list" ? "gem-brand text-primary-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setViewMode("spatial"),
						"aria-label": "3D Spatial view",
						className: cn("flex size-10 items-center justify-center rounded-full text-xs transition-all", viewMode === "spatial" ? "gem-brand text-primary-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "size-4" })
					})]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Loading…"
			}) : viewMode === "spatial" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpatialCanvas, {
				contacts: rows.map((r) => r.contact),
				handles,
				messages
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gem-surface mt-6 rounded-3xl p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Nothing here yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Add someone in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: "People"
						}),
						", or paste a notification in",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: "Capture"
						}),
						"."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "popLayout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: rows.map(({ contact, platforms, last, unread }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
						layout: true,
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							scale: .95
						},
						transition: { duration: .2 },
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/thread/$contactId",
							params: { contactId: contact.id },
							className: "gem-surface flex items-center gap-3.5 rounded-[1.6rem] p-3.5 transition-all active:scale-[0.985] hover:gem-float",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { contact }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate font-semibold tracking-tight",
													children: contact.display_name
												}),
												contact.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
													className: "size-3 shrink-0 text-gold",
													fill: "currentColor"
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-auto shrink-0 text-[11px] text-muted-foreground",
													children: last ? timeAgo(last.sent_at) : ""
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 flex items-center gap-1.5",
											children: [last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
												platform: last.platform,
												size: "xs"
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-xs text-muted-foreground",
												children: last?.body ?? "No messages captured yet"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5 flex flex-wrap gap-1",
											children: platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
												platform: p,
												size: "xs"
											}, p))
										})
									]
								}),
								unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gem-brand flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-primary-foreground shadow-md animate-pulse",
									children: unread
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -right-1 top-1/2 hidden -translate-y-1/2 flex-col gap-1 group-hover:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Move up",
								onClick: () => move(contact.id, -1),
								className: "flex size-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Move down",
								onClick: () => move(contact.id, 1),
								className: "flex size-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" })
							})]
						})]
					}, contact.id))
				})
			})]
		})
	});
}
function Avatar({ contact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold text-primary-foreground"),
		style: {
			backgroundImage: contact.accent ? `linear-gradient(135deg, ${contact.accent}, color-mix(in oklab, ${contact.accent} 55%, var(--gold)))` : "var(--gradient-brand)",
			boxShadow: "var(--shadow-bubble)"
		},
		children: contact.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: contact.avatar_url,
			alt: contact.display_name,
			loading: "lazy",
			className: "size-full object-cover"
		}) : initials(contact.display_name)
	});
}
//#endregion
export { Inbox as component };
