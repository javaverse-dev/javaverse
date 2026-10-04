Roq is a static site generator built on Quarkus. It uses the Qute template engine with FrontMatter headers (YAML between `---` delimiters).

### Quick Start

1. Install via JBang: `curl -Ls https://sh.jbang.dev | bash -s - app install --fresh --force roq@quarkiverse/quarkus-roq`
2. Create a site: `roq create my-site` (adds the default theme with example content)
3. Start dev mode: `cd my-site && roq start` (live-reload on http://localhost:8080, most changes are picked up automatically, use `-p 9090` for a custom port, press `s` to force a soft restart if needed)
4. Build static site: `roq generate` (output in `target/roq/`), preview with `roq serve`
5. Add a plugin or theme: `roq add plugin:tagging`, `roq add theme:default`
6. Update to latest versions: `roq update`

For a minimal HTML structure without the default theme: `roq create my-site -x theme:base`. Use `--no-code` to skip example content, `--gradle` for Gradle.

Available commands: `roq create`, `roq start`, `roq generate`, `roq serve`, `roq add`, `roq update`, `roq blog`. There is NO `roq dev` command, use `roq start` for dev mode.

### AI Agent Integration (Quarkus Agent MCP)

AI coding agents (Claude Code, VS Code Copilot, Cursor, etc.) can manage Roq dev servers using [Quarkus Agent MCP](https://github.com/quarkusio/quarkus-agent-mcp). It handles lifecycle (start, stop, soft restart via `s`), log capture, and proxies to Dev MCP tools in the running app.

**Install via JBang:**
```
jbang app install --fresh --force quarkus-agent-mcp@quarkusio
```

**Configure in Claude Code:**
```
claude mcp add quarkus-agent -- jbang quarkus-agent-mcp@quarkusio
```

**Configure in VS Code / Cursor (`.vscode/mcp.json`):**
```json
{
  "servers": {
    "quarkus-agent": {
      "type": "stdio",
      "command": "jbang",
      "args": ["quarkus-agent-mcp@quarkusio"]
    }
  }
}
```

Once configured, the agent uses `quarkus_start` to launch the Roq dev server, `quarkus_restart` for soft restart, `quarkus_logs` to read output, and `quarkus_searchTools` / `quarkus_callTool` to interact with the running app.

### Directory Structure

```
my-site/
├── content/           # Pages, collections (posts/, etc.), index.html (required)
├── templates/
│   ├── layouts/       # Page layouts (page.html, post.html)
│   └── partials/      # Reusable template fragments
├── data/              # Structured data files (YAML/JSON), accessible via {=cdi:filename.property}
├── public/            # Static assets served as-is (images, PDFs)
├── web/               # JS/CSS sources (bundled by Quarkus Web Bundler)
└── config/
    └── application.properties  # Site config with site.* prefix
```

## Installing Roq Skill Files for AI Coding Assistants

Roq extensions ship detailed reference docs as skill files inside their deployment JARs at `META-INF/quarkus-skill.md`. Follow these steps to install them in your project.

### 1. Find your Roq extensions and version

```
mvn dependency:list -DincludeGroupIds=io.quarkiverse.roq -DoutputAbsoluteArtifactFilename=true
```

### 2. Extract the relevant skills

Extract from the matching JAR in your local Maven repository:
```
unzip -p ~/.m2/repository/io/quarkiverse/roq/ARTIFACT_ID/VERSION/ARTIFACT_ID-VERSION.jar META-INF/quarkus-skill.md > .claude/skills/SHORT_NAME.md
```

Install to the appropriate skills directory (`.claude/skills/` for Claude Code), or append to your CLAUDE.md/AGENTS.md.

Install a skill for each `*-deployment` JAR listed in the dependency output.

### 3. Keep skills in sync

After running `roq update`, re-extract the skill files to match the new version. Compare the Roq version in your dependencies with the version of the installed skill to detect staleness.

**Migrating to Roq:**
- [Migrating to Roq](https://iamroq.dev/docs/migrating/): phased workflow, syntax mappings, configuration reference, and LLM prompts for migrating a Jekyll/Hugo site to Roq

**Skill files (latest version for reference):**
- [quarkus-roq-frontmatter-deployment](https://raw.githubusercontent.com/quarkiverse/quarkus-roq/main/roq-frontmatter/deployment/src/main/resources/META-INF/quarkus-skill.md): base reference (FrontMatter pages, layouts, collections, pagination, template variables, Qute syntax, built-in tags, data files, template extensions, configuration, common pitfalls)
- [quarkus-roq-deployment](https://raw.githubusercontent.com/quarkiverse/quarkus-roq/main/roq/deployment/src/main/resources/META-INF/quarkus-skill.md): full Roq extras (directory structure, themes, RSS, LLMs.txt, static generation, testing, CLI commands)
- [quarkus-roq-data-deployment](https://raw.githubusercontent.com/quarkiverse/quarkus-roq/main/roq-data/deployment/src/main/resources/META-INF/quarkus-skill.md): data file mapping with @DataMapping and CDI

---
The following is the content of this blog site:

# Hello, world! I&#39;m Roq — a funny little SSG (Static Site Generator) with a Java soul and Quarkus energy — Open Source and Free.

> An Open Source static site generator (SSG) that makes it fun and easy to build websites and blogs. It&#39;s built with Java and Quarkus under the hood.

## Marketplace

- [Tailwind CSS](/web/tailwind-css/): Use Tailwind CSS utility classes in your Roq site with automatic purging and optimized builds
- [Svelte](/web/svelte/): Build interactive components with Svelte and embed them in your Roq site
- [Sass](/web/sass/): Write stylesheets with Sass variables, nesting, and mixins for your Roq site
- [mvnpm](/web/mvnpm/): Use npm packages as Maven dependencies with zero Node.js installation required
- [TOC](/plugin/toc/): Generate a table of contents from page headings at build time, with no JavaScript required
- [Tagging](/plugin/tagging/): Auto-generate tag pages and filtered views for any content collection
- [Sitemap](/plugin/sitemap/): Generate an XML sitemap for search engines and an HTML one for visitors
- [Series](/plugin/series/): Organize posts into multi-part series with automatic navigation
- [QR Code](/plugin/qr-code/): Embed auto-generated QR codes for any URL or custom text
- [OG Card](/plugin/og-card/): Generate 1200×630 social preview PNGs from Qute SVG templates
- [Markdown](/plugin/markdown/): Write content in Markdown with CommonMark support, included by default
- [Lunr Search](/plugin/lunr-search/): Add instant full-text search to your site using Lunr.
- [Hybrid](/plugin/hybrid/): Build Quarkus applications with Roq static content, adding runtime page caching, future page scheduling, and cache management
- [Faker](/plugin/faker/): Generate fake blog posts with realistic content for development and testing
- [Diagram](/plugin/diagram/): Render diagrams from code blocks using Kroki (Mermaid, PlantUML, and more)
- [AsciiDoc](/plugin/asciidoc/): Write content in AsciiDoc with a fast, pure-Java processor
- [AsciiDoc JRuby](/plugin/asciidoc-jruby/): Full AsciiDoctor via JRuby with support for all extensions and macros
- [Aliases](/plugin/aliases/): Set up URL redirects and short links to keep old URLs working
- [Resume Theme](/theme/resume-theme/): Build a polished personal resume or CV from simple YAML data files
- [Linktree Theme](/theme/linktree-theme/): Build a personal link-tree to share your links, social profiles, and QR codes
- [Default Theme](/theme/default-theme/): The default Roq theme for blogs and sites, built with Tailwind CSS, featuring dark mode, responsive design, sidebar navigation, and social media links.
- [Base Theme](/theme/base-theme/): Minimal built-in theme with SEO, favicon, and Web Bundler. The ideal starting point to build a fully custom site from scratch.

## Posts

- [Migrate a WordPress blog to Roq](/posts/migrate-from-wordpress-to-roq/): Step-by-step tutorial: move the posts, pages, images, categories and permalinks of a WordPress site to Roq.
- [Pwned: How Roq Saved the Day](/posts/pwned-how-roq-saved-the-day/): How AlpesJUG went from a defaced WordPress site and 17 years of lost data to a new, live community website in a few hours with Roq.
- [Comparing Roq with Hugo, Jekyll, and JBake: A Feature Breakdown](/posts/comparing-roq-with-hugo-jekyll-and-jbake-a-feature-breakdown/)
- [Smarter Search Ranking](/posts/smarter-search-ranking/): How we fixed search boost to let keyword relevance shine.
- [Add Comments to Your Blog with a Web Component (30min)](/posts/add-comments-web-component/): Step-by-step tutorial: build a Lit web component for comments backed by a Quarkus REST API on your Roq blog.
- [Add Comments to Your Blog with Hybrid Mode (30min)](/posts/add-comments-hybrid/): Step-by-step tutorial: add dynamic comments to your Roq blog using hybrid mode, Panache, and Qute templates.
- [Create a Link-Tree with Roq (45min)](/posts/create-a-link-tree-with-roq/): Step-by-step tutorial: build a personal link-tree site from scratch with Roq.
- [Create a Blog from Scratch with Roq (45min)](/posts/create-a-blog-from-scratch-with-roq/): Step-by-step tutorial: build a blog from scratch with Roq using the base theme. Learn layouts, collections, and Tailwind styling.
- [Create your own Blog with Roq (30min)](/posts/create-a-blog-with-roq/): Step-by-step tutorial: create and customize a blog with Roq using the default theme.
- [Collapsible Sections: Hide and Reveal Content in Your Posts](/posts/collapsible-sections-hide-and-reveal-content-in-your-posts/): The Roq default theme now styles HTML collapsible sections out of the box, in both Markdown and AsciiDoc content. Perfect for tutorials with hints, FAQs, and long reference sections.
- [Generate Open Graph Images for Social Sharing with Roq](/posts/generate-open-graph-images-for-social-sharing-with-roq/): Create 1200×630 PNG social preview cards from Qute SVG templates and inject og:image metadata automatically.
- [Generate first class citizen pages from your data](/posts/generate-first-class-citizen-pages-from-your-data/): You can now generate pages dynamically from data collections, perfect for catalogs, team pages, or any content driven by structured data files.
- [Devoured: My Healthy Instagram for Tech News](/posts/devoured-my-healthy-instagram-for-tech-news/): How I built a daily AI-curated tech digest with Roq, replacing doomscrolling with something actually useful.
- [How AI Helped Me Rebuild My Blog and Move from Jekyll to Quarkus Roq](/posts/how-ai-helped-me-rebuild-my-blog-and-move-from-jekyll-to-quarkus-roq/): A comprehensive journey of rebuilding a personal blog with the help of AI, moving from Jekyll to Quarkus Roq, exploring GitHub Issues Driven Development, and discovering how modern AI tools can transform the way we build and maintain websites.
- [GFM Alert Blocks: Styled Callouts in Your Markdown](/posts/gfm-alert-blocks-styled-callouts-in-your-markdown/): Roq supports GitHub Flavored Markdown alert blocks with icons and themed colors. Learn how to use NOTE, TIP, IMPORTANT, WARNING, and CAUTION blocks, and how to add custom alert types.
- [Set It in Roq: The Editor that changes the game!](/posts/set-it-in-roq-the-editor-that-changes-the-game/): Roq introduces a TipTap-powered editor with Markdown support, transforming it from a static site generator into a lightweight, developer-friendly CMS. Create, edit, and preview content seamlessly within the Quarkus dev experience.
- [Roq 2.1 is here!](/posts/roq-2-1-is-here/): Roq 2.1 brings a standalone CLI, LLMs.txt generation, dynamic pages from data, custom error pages, and much more. This post kicks off a series covering all the new features.
- [Roq 2.0 and Java Advent Calendar article](/posts/roq-2-0-and-java-advent-calendar-article/): An introduction to Roq 2.0, a Quarkus-inspired approach to static site generation in Java. Learn about its new foundation, plugin support, and live-reload feature through a practical tutorial.
- [Major site migrations to Roq](/posts/major-site-migrations-to-roq/): ✨ Two prominent websites have just migrated to Roq—any guesses who they might be?
- [More diagram than you could have dreamed of.](/posts/more-diagram-than-you-could-have-dreamed-of/): Leveraging Kroki.io to generate diagram from text
- [🔎 Your users deserve searching capabilities!](/posts/your-users-deserve-searching-capabilities/): No third party service needed 🚀
- [No pain updates with Roq](/posts/no-pain-updates-with-roq/): One of the most overlooked aspects when choosing a Static Site Generator (SSG) is how easy it is to keep your project up to date. Many developers have struggled with complex upgrade processes, dependency conflicts, and breaking changes when using traditional SSGs like Jekyll or Hugo.
- [Roq n Roll Your Tests 🎶](/posts/roq-n-roll-your-tests/): Testing the actual Roq generation has never been this cool! 🎸
- [Easily Generate a `sitemap.xml` for Your Site with Roq](/posts/easily-generate-a-sitemap-xml-for-your-site-with-roq/): Learn how to quickly set up and customize a sitemap.xml for your site using the Roq plugin.
- [Static attached files for posts and pages](/posts/static-attached-files-for-posts-and-pages/): This Christmas, I’m Roq-ing a cool new feature (inspired by Hugo 😅): it is possible to attach static files to posts and pages. They will be served relative to the page. 🎁🤩

- [Already some happy users 🧑‍💻](/posts/already-some-happy-users/): This is a good start, we already have a few happy users!
- [Do you want to publish a blog post series ?](/posts/do-you-want-to-publish-a-blog-post-series/): Make your blog posts part of a series.
- [Need a QR Code?](/posts/need-a-qr-code/): Add a QR Code to your Roq website.
- [Roq with Blogs](/posts/roq-with-blogs/): 🚀 Roq 1.0 is ON! It is time to give it a shot and give us feedback 🚀
- [Write your blog posts in AsciiDoc](/posts/write-your-blog-posts-in-asciidoc/): Automatically generate html from AsciiDoc content
- [RSS Feed of your blog posts](/posts/rss-feed-of-your-blog-posts/): Automatically generate an RSS feed of your blog links.
- [The second Roq plugin is for redirecting your page to a better place!](/posts/the-second-roq-plugin-is-for-redirecting-your-page-to-a-better-place/): We introduced a way to declare aliases in FrontMatter. It is now easy create redirections to your blog posts!
- [The first Roq plugin is for tagging (with pagination)](/posts/the-first-roq-plugin-is-for-tagging-with-pagination/): We introduced the first Roq plugin, it is for collection tagging &amp; with pagination support!
- [Out of the box awesome SEO](/posts/out-of-the-box-awesome-seo/): Learn how to implement SEO in Roq in a blink of an eye.
- [Mastering Pagination in Roq](/posts/mastering-pagination-in-roq/): Learn how to implement pagination in Roq to enhance your content navigation. This article walks through the process of adding pagination, configuring page size, and customizing links.
- [How to add syntax highlighting to your Roq site with Highlight.js](/posts/how-to-add-syntax-highlighting-to-your-roq-site-with-highlight-js/): Learn how to integrate syntax highlighting into your Roq site using Highlight.js and the Quarkus web-bundler extension. This guide walks you through the simple steps to add it via the pom.xml, JavaScript, and SCSS files.
- [Easily manage Drafts and Future articles in Roq](/posts/easily-manage-drafts-and-future-articles-in-roq/): Roq SSG introduces a new feature that allows you to hide or show draft and future articles using simple Quarkus configurations. This update gives developers greater control over which content is visible, improving content management and workflow.
- [Effortless URL Handling in Roq with Qute super-power](/posts/effortless-url-handling-in-roq-with-qute-super-power/): Effortlessly manage both relative and absolute URLs with our enhanced Qute-powered feature. Utilizing the RoqUrl class, you can easily join and resolve paths, ensuring clean and predictable URLs. This update simplifies URL handling, making your code more efficient and your content easier to navigate and share.
- [Welcome to Roq!](/posts/welcome-to-roq/): This is the first article ever made with Quarkus Roq

## Pages

- [Markup Examples](/markups/): Pages demonstrating different markup languages supported by Roq
- [Oops! Roq is saying 404](/404.html)
- [About Roq](/about/): Roq is a powerful static site generator that combines the best features of tools like Jekyll and Hugo, but within the Java ecosystem. It offers a modern approach with Quarkus at its core, requiring zero configuration to get started —ideal for developers who want to jump right in, while still being flexible enough for advanced users to hook into Java for deeper customization.

- [Create a Roq Project](/create/): Start a new Roq static site project
- [Roq Advanced Stuff](/docs/advanced/)
- [Roq the basics](/docs/basics/)
- [Getting started](/docs/getting-started/): Roq allows to easily create a static website or blog using Quarkus super-powers.
- [Migrating to Roq](/docs/migrating/)
- [Publishing a Roq Site](/docs/publishing/)
- [Roq Release Notes](/docs/releases/): Want to follow Roq’s progress and update your project safely? You’re in the right place.
- [Roq Events](/events/): The Roq community is warmly encouraged to share, discuss, and contribute to the project. Whether you&#39;re building something cool, writing a blog post, or giving a talk, we&#39;d love to hear about it!!
- [Plugins &amp; Themes](/marketplace/): Browse plugins and themes for your Roq site
- [AsciiDoc Markup Example](/markups/asciidoc/): All AsciiDoc content types to verify theme styling
- [Markdown Markup Test](/markups/markdown/): All Markdown content types to verify theme styling
- [🎸 The Roqers Hall Of Fame](/roqers/): Already a Roqer? be a part of the hall of fame, please share the link with a small description in the comments and give us your experience.
- [Sitemap](/sitemap/): All pages and posts on this site, grouped for easy browsing.
- [Blog](/blog/): All the latest posts from the Roq team.
- [Blog](/posts/page2/): All the latest posts from the Roq team.
- [Blog](/posts/page3/): All the latest posts from the Roq team.
- [Blog](/posts/page4/): All the latest posts from the Roq team.
- [#blogging](/posts/tag/blogging/)
- [#blogging](/posts/tag/blogging/page2/)
- [#wordpress](/posts/tag/wordpress/)
- [#github-copilot](/posts/tag/github-copilot/)
- [#release](/posts/tag/release/)
- [#ai](/posts/tag/ai/)
- [#happy-users](/posts/tag/happy-users/)
- [#jekyll](/posts/tag/jekyll/)
- [#recovery](/posts/tag/recovery/)
- [#frontmatter](/posts/tag/frontmatter/)
- [#community](/posts/tag/community/)
- [#improvement](/posts/tag/improvement/)
- [#new-feature](/posts/tag/new-feature/)
- [#new-feature](/posts/tag/new-feature/page2/)
- [#new-feature](/posts/tag/new-feature/page3/)
- [#new-feature](/posts/tag/new-feature/page4/)
- [#gfm](/posts/tag/gfm/)
- [#features](/posts/tag/features/)
- [#plugin](/posts/tag/plugin/)
- [#plugin](/posts/tag/plugin/page2/)
- [#plugin](/posts/tag/plugin/page3/)
- [#styling](/posts/tag/styling/)
- [#design](/posts/tag/design/)
- [#migration](/posts/tag/migration/)
- [#markdown](/posts/tag/markdown/)
- [#tutorial](/posts/tag/tutorial/)
- [#tutorial](/posts/tag/tutorial/page2/)
- [#cool-stuff](/posts/tag/cool-stuff/)
- [#cool-stuff](/posts/tag/cool-stuff/page2/)
- [#cool-stuff](/posts/tag/cool-stuff/page3/)
- [#cool-stuff](/posts/tag/cool-stuff/page4/)
- [#seo](/posts/tag/seo/)
- [#guide](/posts/tag/guide/)
- [#quarkus-roq](/posts/tag/quarkus-roq/)