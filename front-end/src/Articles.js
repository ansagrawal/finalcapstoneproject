export function Articles(params) {
  const articles = params.data.articles || [];
  const queryName = params.query.queryName || "na";
  const articleCount = params.data.totalResults || 0;

  return (
    <div>
      <p>Query: {queryName}</p>
      <p>Count: {articleCount}</p>
      <ul className="article-list">
        {articles.map((item, idx) => {
          const title = item && item.title ? item.title : "No Title";
          const trimmedTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;

          return (
            <li key={idx}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {trimmedTitle}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}