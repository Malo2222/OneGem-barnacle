import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as cn } from "./utils-YPEVRlR0.mjs";
import { a as platformMeta } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PlatformBadge-diAC2Db9.js
var import_jsx_runtime = require_jsx_runtime();
function PlatformBadge({ platform, className, size = "sm" }) {
	const meta = platformMeta(platform);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: meta.label,
		className: cn("inline-flex items-center justify-center rounded-full font-semibold tracking-tight", size === "xs" ? "h-4 min-w-4 px-1 text-[9px]" : "h-5 min-w-5 px-1.5 text-[10px]", className),
		style: {
			backgroundColor: `color-mix(in oklab, ${meta.color} 22%, transparent)`,
			color: meta.color,
			border: `1px solid color-mix(in oklab, ${meta.color} 40%, transparent)`
		},
		children: meta.short
	});
}
//#endregion
export { PlatformBadge as t };
