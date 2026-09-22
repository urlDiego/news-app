interface Article {
    id?: number;
    author?: string | null;
    title: string;
    description?: string | null;
    url: string;
    urlToImage?: string | null;
    imageUrl?: string | null;
    image_url?: string | null;
    publishedAt?: string;
    published_at?: string | Date;
    content?: string | null;
    source?: {
        id?: string | null;
        name?: string | null;
    } | string | null;
    categoryName?: string;
    categorySlug?: string;
}

interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

export type { Article, NewsAPIResponse };