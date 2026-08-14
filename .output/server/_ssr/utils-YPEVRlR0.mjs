import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C6FhK068.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-YPEVRlR0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var gem_logo_default = "/assets/gem-logo-C-bfMvee.png";
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		loading
	};
}
function useContacts() {
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("realtime-contacts").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "contacts"
		}, () => {
			qc.invalidateQueries({ queryKey: ["contacts"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	return useQuery({
		queryKey: ["contacts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("contacts").select("id, display_name, avatar_url, accent, pinned, position, notes").order("pinned", { ascending: false }).order("position", { ascending: true }).order("display_name", { ascending: true });
			if (error) throw error;
			return data ?? [];
		},
		refetchInterval: 3e3
	});
}
function useHandles() {
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("realtime-handles").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "handles"
		}, () => {
			qc.invalidateQueries({ queryKey: ["handles"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	return useQuery({
		queryKey: ["handles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("handles").select("id, contact_id, platform, value, label").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		},
		refetchInterval: 3e3
	});
}
function useMessages(contactId) {
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`realtime-messages-${contactId ?? "all"}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "messages"
		}, () => {
			qc.invalidateQueries({ queryKey: ["messages"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc, contactId]);
	return useQuery({
		queryKey: ["messages", contactId ?? "all"],
		queryFn: async () => {
			let q = supabase.from("messages").select("id, contact_id, handle_id, platform, direction, body, sent_at, read").order("sent_at", { ascending: contactId ? true : false }).limit(500);
			if (contactId) q = q.eq("contact_id", contactId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		},
		refetchInterval: 2e3
	});
}
function useInvalidateGem() {
	const qc = useQueryClient();
	return () => {
		qc.invalidateQueries({ queryKey: ["contacts"] });
		qc.invalidateQueries({ queryKey: ["handles"] });
		qc.invalidateQueries({ queryKey: ["messages"] });
	};
}
function useUserId() {
	const { session } = useSession();
	return session?.user.id ?? null;
}
function useSaveContact() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { id, ...rest } = input;
				const { error } = await supabase.from("contacts").update(rest).eq("id", id);
				if (error) throw error;
				return id;
			}
			const { data, error } = await supabase.from("contacts").insert(input).select("id").single();
			if (error) throw error;
			return data.id;
		},
		onSuccess: invalidate
	});
}
function useDeleteContact() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("contacts").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidate
	});
}
function useSaveHandle() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (input) => {
			const { error } = await supabase.from("handles").insert(input);
			if (error) throw error;
		},
		onSuccess: invalidate
	});
}
function useDeleteHandle() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("handles").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidate
	});
}
function useAddMessage() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (input) => {
			const { error } = await supabase.from("messages").insert(input);
			if (error) throw error;
		},
		onSuccess: invalidate
	});
}
function useMarkRead() {
	const invalidate = useInvalidateGem();
	return useMutation({
		mutationFn: async (contactId) => {
			const { error } = await supabase.from("messages").update({ read: true }).eq("contact_id", contactId).eq("read", false);
			if (error) throw error;
		},
		onSuccess: invalidate
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { useDeleteContact as a, useMarkRead as c, useSaveHandle as d, useSession as f, useContacts as i, useMessages as l, gem_logo_default as n, useDeleteHandle as o, useUserId as p, useAddMessage as r, useHandles as s, cn as t, useSaveContact as u };
