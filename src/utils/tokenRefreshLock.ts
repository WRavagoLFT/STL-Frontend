let isRefreshing = false;
let subscribers: (() => void)[] = [];

export const setRefreshing = (value: boolean) => {
  isRefreshing = value;
  if (!isRefreshing) {
    subscribers.forEach((cb) => cb());
    subscribers = [];
  }
};

export const waitUntilNotRefreshing = (): Promise<void> => {
  if (!isRefreshing) return Promise.resolve();
  return new Promise((resolve) => subscribers.push(resolve));
};

export const getIsRefreshing = () => isRefreshing;
