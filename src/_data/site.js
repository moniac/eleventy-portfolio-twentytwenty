/**
  This file can be accessed using: {{ site.title }}
*/

const year = new Date().getFullYear();

module.exports = {
  annee: `${year}`,
  allowDarkMode: true,
  lang: "en", // for html tag
  title: "Mohammed Mulazada's portfolio",
  description:
    "The portfolio of Mohammed Mulazada, an Amsterdam based web developer.",
  url: "https://mohammedmulazada.com", // don't end with a slash /
  brandName: "MM", // for copyright and legal page

  author: {
    name: "Mohammed Mulazada", // for posts meta and Open Graph meta (FB and Twitter)
    email: "mohammedmulazada@gmail.com", // used in legal page
    github: "https://github.com/moniac", // used in footer
    twitter: "https://twitter.com/thisismoniac", // used in footer
  },

  meta_data: {
    theme_color: "#ffffff", // used in Chrome, Firefox OS and Opera
    default_social_image: "/assets/img/featured_image.png", // for Open Graph meta
    locale: "en_US", // for Open Graph meta
    twitter_username: "@thisismoniac", // for Twitter Open Graph meta
  },
};
