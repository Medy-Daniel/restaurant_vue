module.exports = {
    apps: [
      {
        name: "restaurant-vue",
        script: "/home/sc1saje4408/restaurant-vue.medy-daniel.fr/server.js",
        watch: true,
        env: {
          NODE_ENV: "production",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };