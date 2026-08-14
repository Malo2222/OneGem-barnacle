import { n as __exportAll, r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-86PnajQz.js
var router_86PnajQz_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-OooGTMun.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Gem — All your messages in one inbox" },
			{
				name: "description",
				content: "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox. This is because Graham doesn't give a fuck."
			},
			{
				name: "theme-color",
				content: "#0d0813"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Gem"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				property: "og:title",
				content: "Gem — All your messages in one inbox"
			},
			{
				property: "og:description",
				content: "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox. This is because Graham doesn't give a fuck."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Gem — All your messages in one inbox"
			},
			{
				name: "twitter:description",
				content: "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox. This is because Graham doesn't give a fuck."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3fbb2623946f8c02078e51e4ad2a001a/id-preview-6e688f8b--6e4a207a-cb7e-4dee-97a8-082755282b94.lovable.app-1786515797055.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3fbb2623946f8c02078e51e4ad2a001a/id-preview-6e688f8b--6e4a207a-cb7e-4dee-97a8-082755282b94.lovable.app-1786515797055.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("gem-theme");
		document.documentElement.classList.toggle("dark", stored ? stored === "dark" : true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-Db9WIu8n.mjs");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Gem — All your messages in one inbox" },
		{
			name: "description",
			content: "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox."
		},
		{
			property: "og:title",
			content: "Gem — All your messages in one inbox"
		},
		{
			property: "og:description",
			content: "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-Dx9TUVxA.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in to Gem — Your unified message inbox" },
		{
			name: "description",
			content: "Private sign-in for Gem, the one place where your iMessage, Instagram, Snapchat and email conversations live together."
		},
		{
			property: "og:title",
			content: "Sign in to Gem"
		},
		{
			property: "og:description",
			content: "Private access to your unified Gem message inbox."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./capture-CU8XeSlM.mjs");
var Route$3 = createFileRoute("/capture")({
	head: () => ({ meta: [
		{ title: "Capture a message — Gem" },
		{
			name: "description",
			content: "Paste notification text, upload screenshots, or drop images. Gem parses messages and merges contacts automatically."
		},
		{
			property: "og:title",
			content: "Capture a message — Gem"
		},
		{
			property: "og:description",
			content: "Paste notification text or drop screenshots for Gem AI auto-filing."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./people-Cs1BRAzu.mjs");
var Route$2 = createFileRoute("/people")({
	head: () => ({ meta: [
		{ title: "People & handles — Gem" },
		{
			name: "description",
			content: "Merge one person's iMessage, Instagram, Snapchat and email handles into a single Gem contact with a photo and accent colour."
		},
		{
			property: "og:title",
			content: "People & handles — Gem"
		},
		{
			property: "og:description",
			content: "Merge every account a person uses into a single Gem contact."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./settings-CXyTkuQd.mjs");
var Route$1 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Gem" },
		{
			name: "description",
			content: "Install Gem on your iPhone home screen, review how the reply hand-off works, and manage your private account."
		},
		{
			property: "og:title",
			content: "Settings — Gem"
		},
		{
			property: "og:description",
			content: "Install Gem to your home screen and manage your private account."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./thread._contactId-B-mYxR9Q.mjs");
var Route = createFileRoute("/thread/$contactId")({
	head: () => ({ meta: [
		{ title: "Conversation — Gem" },
		{
			name: "description",
			content: "A single merged conversation across iMessage, Instagram, Snapchat and email, with one-tap reply hand-off."
		},
		{
			property: "og:title",
			content: "Conversation — Gem"
		},
		{
			property: "og:description",
			content: "Merged cross-platform conversation with one-tap reply hand-off."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AuthRoute: Route$4.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$6
	}),
	CaptureRoute: Route$3.update({
		id: "/capture",
		path: "/capture",
		getParentRoute: () => Route$6
	}),
	PeopleRoute: Route$2.update({
		id: "/people",
		path: "/people",
		getParentRoute: () => Route$6
	}),
	SettingsRoute: Route$1.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$6
	}),
	ThreadContactIdRoute: Route.update({
		id: "/thread/$contactId",
		path: "/thread/$contactId",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter, router_86PnajQz_exports as t };
