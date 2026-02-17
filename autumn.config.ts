import { product, priceItem } from "atmn";

// Book Products (One-time purchases)
export const bookDigital = product({
  id: "book_digital",
  name: "Cosmic Soul Quest - Digital",
  items: [
    priceItem({
      price: 1499, // $14.99 in cents
    }),
  ],
});

export const bookPaperback = product({
  id: "book_paperback",
  name: "Cosmic Soul Quest - Paperback",
  items: [
    priceItem({
      price: 2499, // $24.99 in cents
    }),
  ],
});

export const bookCollector = product({
  id: "book_collector",
  name: "Cosmic Soul Quest - Collector's Edition",
  items: [
    priceItem({
      price: 3999, // $39.99 in cents
    }),
  ],
});

// Academy Subscriptions (Monthly)
export const academyInitiate = product({
  id: "academy_initiate",
  name: "Academy - Initiate Path",
  items: [
    priceItem({
      price: 4700, // $47/month in cents
      interval: "month",
    }),
  ],
});

export const academyWarrior = product({
  id: "academy_warrior",
  name: "Academy - Warrior Path",
  items: [
    priceItem({
      price: 9700, // $97/month in cents
      interval: "month",
    }),
  ],
});

export const academyMaster = product({
  id: "academy_master",
  name: "Academy - Master Path",
  items: [
    priceItem({
      price: 19700, // $197/month in cents
      interval: "month",
    }),
  ],
});

// Complete Awakening Bundle (One-time purchase)
export const awakeningBundle = product({
  id: "awakening_bundle",
  name: "Complete Awakening Bundle",
  items: [
    priceItem({
      price: 19700, // $197 in cents
    }),
  ],
});

export default {
  products: [
    bookDigital,
    bookPaperback,
    bookCollector,
    academyInitiate,
    academyWarrior,
    academyMaster,
    awakeningBundle,
  ],
  features: [],
};
