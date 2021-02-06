export interface Project {
    title: string
    title_en: string
    description: string
    description_en: string
    link: string
    tags: string
    featured: boolean
    date: Date
    version: string
}

export interface ProjectId extends Project {
    id: string
}
