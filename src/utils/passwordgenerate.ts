export const generateValidPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  const getRandom = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Ensure required characters
  let password = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(special),
  ];

  // Fill remaining with random characters
  for (let i = 4; i < 10; i++) {
    password.push(getRandom(allChars));
  }

  // Shuffle array to avoid predictable order
  password = password.sort(() => 0.5 - Math.random());

  return password.join('');
};

