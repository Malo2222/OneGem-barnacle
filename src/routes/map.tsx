import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/gem/AppShell";
import { PeopleMap } from "@/components/gem/PeopleMap";
import { useContacts, useHandles, useMessages, useSession } from "@/hooks/useGem";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Gem" },
      {
        name: "description",
        content:
          "See everyone you talk to as a living constellation. Pan, zoom and search your network, then tap a face to open the merged conversation.",
      },
      { property: "og:title", content: "Map — Gem" },
      {
        property: "og:description",
        content: "Your whole network as a pannable, zoomable constellation of people.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { data: contacts = [] } = useContacts();
  const { data: handles = [] } = useHandles();
  const { data: messages = [] } = useMessages();
  const { session } = useSession();

  return (
    <AppShell title="Map" subtitle={`${contacts.length} people in orbit`}>
      <PeopleMap
        contacts={contacts}
        handles={handles}
        messages={messages}
        userEmail={session?.user.email}
      />
    </AppShell>
  );
}
