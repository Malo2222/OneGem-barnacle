import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C6FhK068.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { f as useSession, n as gem_logo_default } from "./utils-YPEVRlR0.mjs";
import { t as Button } from "./button-CkJpu_RW.mjs";
import { t as Input } from "./input-D_-8VJDx.mjs";
import { t as Label } from "./label-2DlErg4a.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Dx9TUVxA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { session } = useSession();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (session) navigate({ to: "/" });
	}, [session, navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: window.location.origin }
				});
				if (error) throw error;
				toast.success("Account created. You're in.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 opacity-60 blur-3xl",
			style: { background: "radial-gradient(50% 40% at 50% 15%, color-mix(in oklab, var(--primary) 55%, transparent), transparent), radial-gradient(40% 30% at 80% 90%, color-mix(in oklab, var(--gold) 30%, transparent), transparent)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "gem-surface gem-float relative z-10 w-full max-w-sm rounded-[2rem] p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gem_logo_default,
							alt: "Gem logo",
							width: 72,
							height: 72,
							className: "size-18 h-16 w-16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-3xl font-semibold tracking-tight",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gem-gradient-text",
								children: "Gem"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Every conversation. One place."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-7 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "h-12 rounded-2xl bg-surface-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								autoComplete: mode === "signup" ? "new-password" : "current-password",
								required: true,
								minLength: 6,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "h-12 rounded-2xl bg-surface-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							className: "gem-brand h-12 w-full rounded-2xl text-base font-semibold text-primary-foreground shadow-[var(--shadow-bubble)] transition-transform active:scale-[0.98]",
							children: busy ? "One sec…" : mode === "signup" ? "Create account" : "Unlock Gem"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					className: "mt-5 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline",
					children: mode === "signin" ? "First time? Create your account" : "Already set up? Sign in"
				})
			]
		})]
	});
}
//#endregion
export { AuthPage as component };
