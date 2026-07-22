"use client";

import Giscus from "@giscus/react";

export function Comments() {
  return (
    <Giscus
      repo="biisal/blog-comments"
      repoId="R_kgDOTgVedA"
      category="Announcements"
      categoryId="DIC_kwDOTgVedM4DBvQu"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="bottom"
      theme="dark"
      lang="en"
    />
  );
}
