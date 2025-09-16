export interface RepoContentItem {
  name:string
  path:string
  size:string
  downloadUrl:string
  type:'dir'|'file'
  contents:RepoContentItem[]
}

export interface Repository {
  name:string
  description:string
  topics:string[]
  languages:Record<string, number>
  contents:RepoContentItem[]
}
