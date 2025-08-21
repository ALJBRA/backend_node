export default {
  test: {
    environment: "node",
    globals: true,
    timeout: 10000,
    include: ["tests/**/*.test.js"],
    coverage: {
      reporter: ["text", "html", "json"],
    },
  },
};
