export interface News {
    title: string
    title_en: string
    description: string
    description_en: string
    url: string
    image: string
    timestamp: Date
    loaded: boolean
}

export interface NewsId extends News {
    id: string
}
