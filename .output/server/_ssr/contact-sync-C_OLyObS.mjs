//#region node_modules/.nitro/vite/services/ssr/assets/contact-sync-C_OLyObS.js
/**
* Normalizes contact names for fuzzy identity merging.
* e.g., "Chloe Smith" -> "chloe smith", "Chloe" -> "chloe"
*/
function normalizeName(name) {
	return name.trim().toLowerCase().replace(/[^\w\s]/g, "");
}
/**
* Fuzzy check if two names are closely related / alike
*/
function isAlikeName(a, b) {
	const normA = normalizeName(a);
	const normB = normalizeName(b);
	if (!normA || !normB) return false;
	if (normA === normB) return true;
	if (normA.includes(normB) || normB.includes(normA)) return true;
	return false;
}
/**
* Parses vCard (.vcf) file content into structured RawImportedContact array.
*/
function parseVCard(vCardText) {
	const cards = vCardText.split(/END:VCARD/i);
	const results = [];
	for (const card of cards) {
		if (!card.includes("BEGIN:VCARD")) continue;
		let displayName = "";
		const phoneNumbers = [];
		const emails = [];
		const socialHandles = [];
		const lines = card.split(/\r?\n/);
		for (const line of lines) if (line.startsWith("FN:") || line.startsWith("FN;")) displayName = line.substring(line.indexOf(":") + 1).trim();
		else if (line.startsWith("TEL:") || line.includes("TEL;")) {
			const phone = line.substring(line.indexOf(":") + 1).replace(/[^\d+]/g, "").trim();
			if (phone) phoneNumbers.push(phone);
		} else if (line.startsWith("EMAIL:") || line.includes("EMAIL;")) {
			const email = line.substring(line.indexOf(":") + 1).trim();
			if (email) emails.push(email);
		} else if (line.includes("instagram.com/") || line.includes("X-SOCIALPROFILE")) {
			const val = line.substring(line.indexOf(":") + 1).trim();
			if (val.includes("instagram")) {
				const match = val.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
				if (match) socialHandles.push({
					platform: "instagram",
					value: `@${match[1]}`
				});
			} else if (val.includes("snapchat")) {
				const match = val.match(/snapchat\.com\/add\/([a-zA-Z0-9._]+)/);
				if (match) socialHandles.push({
					platform: "snapchat",
					value: match[1]
				});
			}
		}
		if (displayName || phoneNumbers.length > 0 || emails.length > 0) results.push({
			displayName: displayName || phoneNumbers[0] || emails[0] || "Imported Contact",
			phoneNumbers,
			emails,
			socialHandles
		});
	}
	return results;
}
/**
* Triggers standard Browser Contacts Picker API (`navigator.contacts`) if available on mobile/device.
*/
async function pickDeviceContacts() {
	const nav = typeof window !== "undefined" ? navigator : void 0;
	if (nav?.contacts?.select) try {
		return (await nav.contacts.select([
			"name",
			"tel",
			"email",
			"icon"
		], { multiple: true })).map((c) => {
			const name = Array.isArray(c.name) ? c.name[0] : c.name || "";
			const phones = (c.tel || []).map((t) => t.replace(/[^\d+]/g, ""));
			const emails = c.email || [];
			const photoUrl = c.icon && c.icon[0] instanceof Blob ? URL.createObjectURL(c.icon[0]) : void 0;
			return {
				displayName: name || phones[0] || emails[0] || "Device Contact",
				phoneNumbers: phones,
				emails,
				socialHandles: [],
				photoUrl
			};
		});
	} catch (err) {
		console.warn("Device Contacts selection cancelled or failed:", err);
	}
	return [];
}
//#endregion
export { parseVCard as n, pickDeviceContacts as r, isAlikeName as t };
