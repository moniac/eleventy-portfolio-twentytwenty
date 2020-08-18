const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginTOC = require("eleventy-plugin-toc");

// Plugins
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const mdOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
};
const mdAnchorOpts = {
  permalink: true,
  permalinkClass: "anchor-link",
  permalinkSymbol: "#",
  level: [1, 2, 3, 4],
};

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary(
    "md",
    markdownIt(mdOptions).use(markdownItAnchor, mdAnchorOpts)
  );
  eleventyConfig.addPlugin(pluginTOC);

  // OPT-OUT OF USING .gitignore to prevent reload issue when css change
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");

  // Date helpers
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("dd LLLL yyyy");
  });
  eleventyConfig.addFilter("htmlDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("y-MM-dd");
  });

  // compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/_utils/minify-js.js"));

  // minify the html output when running in prod
  if (process.env.ELEVENTY_ENV == "production") {
    eleventyConfig.addTransform(
      "htmlmin",
      require("./src/_utils/minify-html.js")
    );
  }

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    passthroughFileCopy: true,
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
