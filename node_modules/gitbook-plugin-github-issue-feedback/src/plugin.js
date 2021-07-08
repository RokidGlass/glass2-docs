var path = require("path");
var urlJoin = require("url-join");
var BugReporter = require("./BugReporter");
var findAllPositions = require("position-map-text-to-markdown").findAllPositions;

function quoteText(text) {
    return text.split("\n").map(function(line) {
        return "> " + line;
    }).join("\n");
}

function getContentAsync(contentURL) {
  if (/^https:\/\/api.github.com\/repos/.test(contentURL)) {
    // https://github.com/jser/jser.info/edit/gh-pages/data/2015/08/index.json
    // => https://api.github.com/repos/jser/jser.info/contents/data/2015/08/index.json
    return fetch(contentURL).then(function(response) {
        return response.json();
    }).then(function(response) {
        return decodeURIComponent(escape(atob(response.content)));
    });
  } else {
    return fetch(contentURL, { credentials: "same-origin" }).then(function(response) {
        return response.text();
    });
  }
}

function getResourceURL(config, filePath, branch) {
    if (config["markdownBaseURL"]) {
        return urlJoin(config["markdownBaseURL"], filePath);
    }
    return urlJoin(`https://github.com/`, config.repo, `blob`, branch, filePath);
}

function getEditURL(config, filePath, branch) {
    return urlJoin(`https://github.com/`, config.repo, `edit`, branch, filePath);
}
function getContentURL(config, filePath) {
    if (config.private) {
        return urlJoin(
            location.origin,
            /\.github\.io$/.test(config.repo) ? '' : config.repo.split('/')[1],
            "gitbook/gitbook-plugin-github-issue-feedback/contents",
            filePath
        );
    } else {
        if (config["githubAPIBaseURL"]) {
            return urlJoin(config["githubAPIBaseURL"], filePath);
        }
        return urlJoin(`https://api.github.com/repos/`, config.repo, `contents`, filePath);
    }
}

function getIssueURL(config) {
    if (config["newIssueURL"]) {
        return config["newIssueURL"];
    }
    return urlJoin(`https://github.com/`, config.repo, `/issues/new`);
}
window.require(["gitbook"], function(gitbook) {
    // plugin config
    gitbook.events.bind("start", function(e, pluginConfig) {
        var config = pluginConfig["github-issue-feedback"];
        var reportElement = document.createElement("button");
        reportElement.textContent = config["label"] || "Bug Report";
        reportElement.className = "gitbook-plugin-github-issue-feedback";
        reportElement.setAttribute("style", "position:fixed; right:0;bottom:0;");
        var clickEvent = ("ontouchstart" in window) ? "touchend" : "click";
        reportElement.addEventListener(clickEvent, function(event) {
            var pathname = path.join(gitbook.state.config.root || "./", gitbook.state.filepath);
            var contentURL = getContentURL(config, pathname);
            var resourceURL = getResourceURL(config, pathname, "master");
            var editURL = getEditURL(config, pathname, "master");
            var chapterTitle = gitbook.state.chapterTitle;
            var bug = new BugReporter(getIssueURL(config));
            var selectedText = bug.getSelectedText().trim();
            bug.setTitle(chapterTitle);
            getContentAsync(contentURL).then(function(markdown) {
                let body = 'URL : ' + resourceURL + "\n\n";
                if (selectedText && selectedText.length > 0) {
                    var matches = findAllPositions({
                        text: selectedText,
                        markdown: markdown
                    });
                    matches.forEach(function(match) {
                        var editLink = `[:memo:](${editURL}#L${match.loc.start.line} "Edit")`;
                        body += quoteText(match.markdown + "\n" +
                                `${editLink} <${resourceURL}#L${match.loc.start.line}>`) + "\n\n";
                    });
                }
                bug.setBody(body);
                bug.report();
            });
        });
        document.body.appendChild(reportElement);
    });

});
