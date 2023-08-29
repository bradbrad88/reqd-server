export default {};

type Item = {
  itemId: string;
  displayName: string;
  brand: string;
  size: number;
  units: string;
};
export const items: Item[] = [
  { itemId: "abcd1234", brand: "Coke", displayName: "Coke", size: 600, units: "mL" },
  { itemId: "abcd1235", brand: "Coke", displayName: "Sprite", size: 600, units: "mL" },
  { itemId: "abcd1236", brand: "Coopers", displayName: "Pale Ale", size: 375, units: "mL" },
];

export const order1 = [
  {
    itemId: "123",
    areas: [
      { area: "some area", amount: 2 },
      { area: "another area", amount: 1 },
    ],
  },
];
