import { defineConfig, defineCollection, s } from "velite";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  // get slug from path aka data.slug used on the server by the PostPage 
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
    })
    .transform(computedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite", // internal generated dir -- must be ignored
    assets: "public/static", // asset dir path relative to this config file
    base: "/static/", // public base asset path
    name: "[name]-[hash:6].[ext]", // template for file naming
    // name-6charhash.fileextension
    clean: true, // cleans the output dir before build
  },
  collections: { posts },
  mdx: {
    // mdx plugins can be added here
    rehypePlugins: [],
    remarkPlugins: [],
  },
});