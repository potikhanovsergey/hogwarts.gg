import { getPostBySlug } from '#/lib/posts';
import { getURL } from '#/lib/utils';
import { DefaultTags } from '#/ui/DefaultTags';

export default async function Head({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  const post = await getPostBySlug(slug, { published: true });
  if (!post) {
    return <DefaultTags />;
  }

  const alternativeLangs = post.posts.map((post) => (
    <link
      key={post.id}
      rel="alternate"
      href={getURL(`/${post.language}/blog/${post.slug}`)}
      hrefLang={post.language}
      type="text/html"
      title={post.title!}
    />
  ));

  return (
    <>
      <DefaultTags />
      <title>{`${post.title} - Hogwarts Legacy Map and Tools - Hogwarts.gg`}</title>
      <meta
        name="title"
        content={`${post.title} - Hogwarts Legacy Map and Tools - Hogwarts.gg`}
      />
      <meta
        name="description"
        content="Get all the Hogwarts Legacy locations, secrets, chests, entrances and more."
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.hogwarts.gg/" />
      <meta
        property="og:title"
        content={`${post.title} - Hogwarts Legacy Map and Tools - Hogwarts.gg`}
      />
      <meta
        property="og:description"
        content="Get all the Hogwarts Legacy locations, secrets, chests, entrances and more."
      />
      <meta property="og:image" content="/assets/social.jpg" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.hogwarts.gg/" />
      <meta
        property="twitter:title"
        content={`${post.title} - Hogwarts Legacy Map and Tools - Hogwarts.gg`}
      />
      <meta
        property="twitter:description"
        content="Get all the Hogwarts Legacy locations, secrets, chests, entrances and more."
      />
      <meta property="twitter:image" content="/assets/social.jpg" />
      {alternativeLangs}
    </>
  );
}
