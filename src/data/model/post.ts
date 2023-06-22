export interface Post {
    title: string
    title_en: string
    description: string
    description_en: string
    link: string
    image: string
    date: Date
    loaded: boolean
    internalLink?: string
}

export interface PostsId extends Post {
    id: string
}
