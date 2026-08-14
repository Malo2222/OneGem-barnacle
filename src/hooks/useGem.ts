import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Contact = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  accent: string | null;
  pinned: boolean;
  position: number;
  notes: string | null;
  muted_until?: string | null;
};

export type Handle = {
  id: string;
  contact_id: string;
  platform: string;
  value: string;
  label: string | null;
};

export type Message = {
  id: string;
  contact_id: string | null;
  handle_id: string | null;
  platform: string;
  direction: string;
  body: string;
  sent_at: string;
  read: boolean;
};

export type DeviceToken = {
  id: string;
  user_id: string;
  name: string | null;
  token: string;
  active: boolean;
  created_at: string;
  last_used_at: string | null;
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return { session, loading };
}

export function useContacts() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-contacts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        () => {
          qc.invalidateQueries({ queryKey: ["contacts"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["contacts"],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id, display_name, avatar_url, accent, pinned, position, notes")
        .order("pinned", { ascending: false })
        .order("position", { ascending: true })
        .order("display_name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 3000,
  });
}

export function useHandles() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-handles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "handles" },
        () => {
          qc.invalidateQueries({ queryKey: ["handles"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["handles"],
    queryFn: async (): Promise<Handle[]> => {
      const { data, error } = await supabase
        .from("handles")
        .select("id, contact_id, platform, value, label")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 3000,
  });
}

export function useMessages(contactId?: string) {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-messages-${contactId ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          qc.invalidateQueries({ queryKey: ["messages"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc, contactId]);

  return useQuery({
    queryKey: ["messages", contactId ?? "all"],
    queryFn: async (): Promise<Message[]> => {
      let q = supabase
        .from("messages")
        .select(
          "id, contact_id, handle_id, platform, direction, body, sent_at, read",
        )
        .order("sent_at", { ascending: contactId ? true : false })
        .limit(500);
      if (contactId) q = q.eq("contact_id", contactId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 2000,
  });
}

export function useInvalidateGem() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["contacts"] });
    qc.invalidateQueries({ queryKey: ["handles"] });
    qc.invalidateQueries({ queryKey: ["messages"] });
  };
}

export function useUserId() {
  const { session } = useSession();
  return session?.user.id ?? null;
}

export function useGemRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("gem-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages"] });
          queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["contacts"] });
          queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "handles" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["handles"] });
          queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useDeviceTokens() {
  return useQuery({
    queryKey: ["device_tokens"],
    queryFn: async (): Promise<DeviceToken[]> => {
      const { data, error } = await supabase
        .from("device_tokens")
        .select("id, user_id, name, token, active, created_at, last_used_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateDeviceToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; name?: string | null; token: string }) => {
      const { data, error } = await supabase.from("device_tokens").insert(input).select().single();
      if (error) throw error;
      return data as DeviceToken;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["device_tokens"] }),
  });
}

export function useRevokeDeviceToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_tokens").update({ active: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["device_tokens"] }),
  });
}

export function useSaveContact() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (input: {
      id?: string;
      user_id: string;
      display_name: string;
      avatar_url?: string | null;
      accent?: string | null;
      pinned?: boolean;
      position?: number;
      notes?: string | null;
    }) => {
      if (input.id) {
        const { id, ...rest } = input;
        const { error } = await supabase
          .from("contacts")
          .update(rest)
          .eq("id", id);
        if (error) throw error;
        return id;
      }
      const { data, error } = await supabase
        .from("contacts")
        .insert(input)
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteContact() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useSaveHandle() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (input: {
      user_id: string;
      contact_id: string;
      platform: string;
      value: string;
      label?: string | null;
    }) => {
      const { error } = await supabase.from("handles").insert(input);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteHandle() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("handles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useAddMessage() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (input: {
      user_id: string;
      contact_id: string;
      handle_id?: string | null;
      platform: string;
      direction: "incoming" | "outgoing";
      body: string;
      raw?: string | null;
      sent_at?: string;
      read?: boolean;
    }) => {
      const { error } = await supabase.from("messages").insert(input);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useMarkRead() {
  const invalidate = useInvalidateGem();
  return useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("contact_id", contactId)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}
