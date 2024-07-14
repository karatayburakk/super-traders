interface UserProps {
  username: string;
  password: string;
}

interface ShareProps {
  symbol: string;
  price: number;
}

export const users: UserProps[] = [
  { username: "testUser", password: "123456" },
  { username: "testUser2", password: "123456" },
  { username: "testUser3", password: "123456" },
  { username: "testUser4", password: "123456" },
  { username: "testUser5", password: "123456" },
];

export const shares: ShareProps[] = [
  { symbol: "ABC", price: 5000 },
  { symbol: "XYZ", price: 10000 },
  { symbol: "QRS", price: 40000 },
  { symbol: "STR", price: 1000 },
];
