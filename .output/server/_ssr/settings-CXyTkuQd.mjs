import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C6FhK068.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { f as useSession } from "./utils-YPEVRlR0.mjs";
import { t as Button } from "./button-CkJpu_RW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as Check, M as Copy, c as Terminal, f as Smartphone, p as ShieldCheck, w as LogOut } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-BGv4OLxh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CXyTkuQd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { session } = useSession();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/public/ingest` : "";
	const copyWebhook = () => {
		if (!webhookUrl) return;
		navigator.clipboard.writeText(webhookUrl);
		setCopied(true);
		toast.success("Ingest Webhook URL copied to clipboard!");
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Settings",
		subtitle: session?.user.email ?? "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "gem-surface rounded-[1.6rem] p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4 text-gold" }), " Put Gem on your iPhone"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 space-y-1.5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Open this URL in Safari on your phone." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Share sheet → Add to Home Screen → name it Gem." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Launch from the icon — full screen PWA widget behavior." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Sign in once; session stays logged in." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "gem-surface rounded-[1.6rem] p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4 text-gold" }), " Automatic SMSBridge Webhook"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Configure your Mac Shortcuts or Notification bridge to POST incoming messages automatically:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between rounded-xl bg-surface-2 p-2.5 text-[11px] font-mono text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate max-w-[260px]",
								children: webhookUrl || "/api/public/ingest"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyWebhook,
								className: "flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary/30",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "gem-surface rounded-[1.6rem] p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-gold" }), " How replying works"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted-foreground",
						children: "Apple sandboxes Messages, Instagram and Snapchat — no app or shortcut can post for you without getting the account banned. Gem instead copies your typed reply and deep-links straight into that person's real chat, so you paste and hit send. Opening a deep link never sends a snap, opens a story, or fires a read receipt."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => supabase.auth.signOut(),
					className: "h-11 w-full gap-2 rounded-2xl text-sm text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
