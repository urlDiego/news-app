interface Article {
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
    source: {
        id: string | null;
        name: string | null;
    }
}
interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

export type {Article, NewsAPIResponse}