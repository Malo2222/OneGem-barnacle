globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs").then((n) => n.l)) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"1227-kNMc3MHPH7VPuFWpH5GAQGpH9v0\"",
		"mtime": "2026-08-12T20:34:01.226Z",
		"size": 4647,
		"path": "../public/favicon.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"185-+h+PAJYqAr5vmu78TxJ/19svKAM\"",
		"mtime": "2026-08-12T20:34:01.226Z",
		"size": 389,
		"path": "../public/manifest.webmanifest"
	},
	"/assets/AppShell-CQ7gb7oN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16ba-oU4MXEKcpyz+9OFcXnLUPMsq2AU\"",
		"mtime": "2026-08-12T20:34:00.650Z",
		"size": 5818,
		"path": "../public/assets/AppShell-CQ7gb7oN.js"
	},
	"/assets/PlatformBadge-CUHKgJH2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a51-5aoYyqPJeMpmJgSsVjhKklBRoCo\"",
		"mtime": "2026-08-12T20:34:00.650Z",
		"size": 2641,
		"path": "../public/assets/PlatformBadge-CUHKgJH2.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-12T20:34:01.226Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/auth-Cf_b5jJ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3f-+Ip59UNLoC1ZB7diGeZ94XjBpoA\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 3135,
		"path": "../public/assets/auth-Cf_b5jJ2.js"
	},
	"/assets/button-aEB4jV-D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1273-/mQMkg4cI9gyvR8maKTqq3iC1k4\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 4723,
		"path": "../public/assets/button-aEB4jV-D.js"
	},
	"/assets/capture-Bprd_W_2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1deb-O7OelgBTZjHDziuP67+2cG+gGq0\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 7659,
		"path": "../public/assets/capture-Bprd_W_2.js"
	},
	"/assets/contact-sync-BxD93RrM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a5-mJhjdKieWuyKpRW/50zjWOyGUmo\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 1701,
		"path": "../public/assets/contact-sync-BxD93RrM.js"
	},
	"/assets/QueryClientProvider-D-KUmDGx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3aa6f-GlnLxYx5edaPEDHLV5INPOkfWLs\"",
		"mtime": "2026-08-12T20:34:00.650Z",
		"size": 240239,
		"path": "../public/assets/QueryClientProvider-D-KUmDGx.js"
	},
	"/assets/input-CGwVTSEq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a1-a0x5zAWA6WGf91Zd3qe+OvztWUg\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 673,
		"path": "../public/assets/input-CGwVTSEq.js"
	},
	"/assets/gem-logo-C-bfMvee.png": {
		"type": "image/png",
		"etag": "\"1c2da-Inf+2Bfyz4xNLMQIkTastBqzLYw\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 115418,
		"path": "../public/assets/gem-logo-C-bfMvee.png"
	},
	"/assets/label-_9lCr3Gi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f7-2Yv7Jfs2NvyyohzZiPSZdWRadVw\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 1271,
		"path": "../public/assets/label-_9lCr3Gi.js"
	},
	"/assets/link-0XfOff59.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d03-/IGJnKBEJLg7rsYcxMTK14+5FVI\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 23811,
		"path": "../public/assets/link-0XfOff59.js"
	},
	"/assets/people-Be2uQzsh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20bb-Fl+pY1jKY9iOGIDdCYmIcIw5MFU\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 8379,
		"path": "../public/assets/people-Be2uQzsh.js"
	},
	"/assets/react-DJEExdcn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ea30-8eQH3W1ume5JAssLF5B12RUz2tU\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 125488,
		"path": "../public/assets/react-DJEExdcn.js"
	},
	"/assets/rolldown-runtime-CbXtAM7H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24d-+aXgvbJ1Wwcp2A8AXKIBByksYC8\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 589,
		"path": "../public/assets/rolldown-runtime-CbXtAM7H.js"
	},
	"/assets/routes-CwRN_LfA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3862-xcXoUf6v37gHb8WaSAl9vF0Owmc\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 14434,
		"path": "../public/assets/routes-CwRN_LfA.js"
	},
	"/assets/settings-f30PZxbz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f72-cXWyjgBv7PhgVSF8NgGBmajdL2k\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 3954,
		"path": "../public/assets/settings-f30PZxbz.js"
	},
	"/assets/sparkles-CvhmjRW-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b-K/X7wLGEg86WtZsER9fl8DuVobY\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 779,
		"path": "../public/assets/sparkles-CvhmjRW-.js"
	},
	"/assets/styles-OooGTMun.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15f8a-KPMuWZWNEvP9qqPIlmF9qY84uQU\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 89994,
		"path": "../public/assets/styles-OooGTMun.css"
	},
	"/assets/textarea-DrokVLkE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23b-o8vfaHJM2T7atCQXFTF1IkeBrOw\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 571,
		"path": "../public/assets/textarea-DrokVLkE.js"
	},
	"/assets/index-DbEYn3Qg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51d1a-joyTrq0cz8VB0gyJZ+IPbaps0F0\"",
		"mtime": "2026-08-12T20:34:00.645Z",
		"size": 335130,
		"path": "../public/assets/index-DbEYn3Qg.js"
	},
	"/icon-512.png": {
		"type": "image/png",
		"etag": "\"19523-NqkKFk4DRxYysyvoSXIKijM1TsI\"",
		"mtime": "2026-08-12T20:34:01.226Z",
		"size": 103715,
		"path": "../public/icon-512.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"5089-gPc4FJrx6foIddp0LyYlSnuc9b8\"",
		"mtime": "2026-08-12T20:34:01.226Z",
		"size": 20617,
		"path": "../public/apple-touch-icon.png"
	},
	"/assets/utils-CpY6hEgW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a207-KqKvYfsj6GLBtvC2xdo9qPccT60\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 41479,
		"path": "../public/assets/utils-CpY6hEgW.js"
	},
	"/assets/thread._contactId-BgSlp9uB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c59-p9Sv5E3XbyU+hfY1oUGDNVZwSrM\"",
		"mtime": "2026-08-12T20:34:00.651Z",
		"size": 11353,
		"path": "../public/assets/thread._contactId-BgSlp9uB.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_RfVFMN = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_RfVFMN
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
