// Shared site data for the café website.
// Every module reads its content from this object; nothing here is secret.

export const SITE = {
  name: "Café Morgenlicht",
  tagline: "Kaffee, Kuchen und ein ruhiger Platz im Herzen der Stadt",
  address: {
    street: "Lindenstraße 14",
    postalCode: "50674",
    city: "Köln",
  },
  phone: "+49 221 5550142",
  email: "hallo@cafe-morgenlicht.example",
  mapUrl: "https://www.openstreetmap.org/search?query=Lindenstra%C3%9Fe%2014%2C%2050674%20K%C3%B6ln",
  openingHours: {
    monday: { open: "08:00", close: "18:00" },
    tuesday: { open: "08:00", close: "18:00" },
    wednesday: { open: "08:00", close: "18:00" },
    thursday: { open: "08:00", close: "18:00" },
    friday: { open: "08:00", close: "19:00" },
    saturday: { open: "09:00", close: "19:00" },
    sunday: null,
  },
};
