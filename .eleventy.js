const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const CleanCSS = require("clean-css");
const readingTime = require("eleventy-plugin-reading-time");
const Terser = require("terser");
const Image = require("@11ty/eleventy-img");

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
  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

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
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async (code, callback) => {
    try {
      const minified = await Terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });

  eleventyConfig.addNunjucksAsyncShortcode("myImage", async function (
    src,
    alt,
    outputFormat = "jpeg"
  ) {
    if (alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    // returns Promise
    let stats = await Image(src, {
      widths: [50],
      formats: ["webp", "jpeg"],
      urlPath: "/assets/img/",
      outputDir: "./_site/assets/img/",
    });

    let props = stats[outputFormat].pop();

    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}">`;
  });

  eleventyConfig.addNunjucksAsyncShortcode("myResponsiveImage", async function (
    src,
    alt,
    outputFormat = "jpeg",
    className
  ) {
    if (alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myResponsiveImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [480, 900, 1200, null],
      formats: ["webp", "jpeg"],
      urlPath: "/assets/img/",
      outputDir: "./_site/assets/img/",
    });
    let lowestSrc = stats[outputFormat.split(",")[0]][0];
    let sizes =
      "(min-width: 350px) 480w, (min-width: 950px) 1200w, (min-width: 1300px) 1600w, 100vw"; // Make sure you customize this!

    // Iterate over formats and widths
    return `<picture>
      ${Object.values(stats)
        .map((imageFormat) => {
          return `<source type="image/${
            imageFormat[0].format
          }" srcset="${imageFormat
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(", ")}" sizes="${sizes}">`;
        })
        .join("\n")}
        <img
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}"
          alt=${alt}
          class="${className}">
      </picture>`;
  });

  eleventyConfig.addFilter("log", (value) => {
    console.log(value);
  });

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
