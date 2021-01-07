if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { execSync } = require("child_process");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version, "agri-version": agriVersion } = require("./package.json");

  const gitCommand = "git rev-parse HEAD";

  const gitHash = execSync(gitCommand).toString().trim();

  fs.writeFileSync(
    "./public/version.js",
    `console.log('当前版本信息', {
      version: '${version || agriVersion}',
      git_hash: '${gitHash}',
      time: '${new Date()}',
    })`
  );
}

module.exports = {
  pwa: {
    iconPaths: {
      favicon32: "img/icons/favicon.png",
      favicon16: "img/icons/favicon.png",
      appleTouchIcon: "img/icons/favicon.png",
      maskIcon: "img/icons/favicon.png",
      msTileImage: "img/icons/favicon.png",
    },
  },
};
