export interface Work {
    avatar: string
    name: string
    name_en: string
    description: string
    description_en: string
    job: string
    job_en: string
    loaded: false
    importance: number
}

export interface WorkId extends Work {
    id: string
}
