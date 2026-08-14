import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { f as useSession, n as gem_logo_default, t as cn } from "./utils-YPEVRlR0.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Inbox, S as Moon, i as Users, l as Sun, m as Settings, v as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-BGv4OLxh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useTheme() {
	const [dark, setDark] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("gem-theme");
		const next = stored ? stored === "dark" : true;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
	}, []);
	const toggle = () => {
		setDark((prev) => {
			const next = !prev;
			localStorage.setItem("gem-theme", next ? "dark" : "light");
			document.documentElement.classList.toggle("dark", next);
			return next;
		});
	};
	return {
		dark,
		toggle
	};
}
function ThemeToggle() {
	const { dark, toggle } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: toggle,
		"aria-label": "Toggle theme",
		className: "flex size-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted-foreground transition-all active:scale-95 hover:text-foreground",
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
var NAV = [
	{
		to: "/",
		label: "Inbox",
		icon: Inbox
	},
	{
		to: "/capture",
		label: "Capture",
		icon: Plus
	},
	{
		to: "/people",
		label: "People",
		icon: Users
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ children, title, subtitle, action }) {
	const { session, loading } = useSession();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (!loading && !session) navigate({ to: "/auth" });
	}, [
		loading,
		session,
		navigate
	]);
	if (loading || !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: gem_logo_default,
			alt: "Gem",
			width: 64,
			height: 64,
			className: "size-16 animate-pulse"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none fixed inset-x-0 top-0 h-64 opacity-50 blur-3xl",
				style: { background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 45%, transparent), transparent)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gem_logo_default,
						alt: "Gem logo",
						width: 36,
						height: 36,
						className: "size-9 drop-shadow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-xl font-semibold tracking-tight",
							children: title ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gem-gradient-text",
								children: "Gem"
							})
						}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: subtitle
						}) : null]
					}),
					action,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 px-4",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "gem-surface gem-float mx-auto flex max-w-md items-center justify-between rounded-full p-1.5 backdrop-blur-xl",
					children: NAV.map(({ to, label, icon: Icon }) => {
						const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							className: cn("flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-all active:scale-95", active ? "gem-brand text-primary-foreground shadow-[var(--shadow-bubble)]" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" }), label]
						}, to);
					})
				})
			})
		]
	});
}
//#endregion
export { AppShell as t };
