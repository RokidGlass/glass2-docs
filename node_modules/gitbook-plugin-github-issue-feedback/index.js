// MIT © 2017 azu
"use strict";

const path = require("path")
const fse = require("fs-extra")

module.exports = {
    website: {
        assets: "./assets",
        js: [
            "plugin.js"
        ]
    },
    hooks: {
        finish: function() {
            // check configuration
            const pluginsConfig = this.config.get("pluginsConfig")
            const isPrivateRepo =
                pluginsConfig !== undefined &&
                pluginsConfig["github-issue-feedback"] !== undefined &&
                pluginsConfig["github-issue-feedback"].private === true

            // copy contents for private repository
            if (isPrivateRepo) {
                const source = this.config.get("root", "./")
                const target = path.join("./_book/gitbook/gitbook-plugin-github-issue-feedback/contents", source)
                fse.copySync(source, target)
            }
        }
    }
};
