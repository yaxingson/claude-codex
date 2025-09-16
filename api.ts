import type { Repository, RepoContentItem } from './types'

const accessToken = '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'

const getRepoLanguages = async (owner:string, repo:string) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/languages`
  
  const response = await fetch(url, { headers:{'Authorization':`token ${accessToken}`}})
  const result = await response.json()

  return result
}

const getRepoContents = async (owner:string, repo:string, path:string=''):Promise<RepoContentItem[]> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

  const response = await fetch(url, { headers:{'Authorization':`token ${accessToken}`}})
  const result = await response.json()

  for(const item of result) {
    if (item.type === 'dir') {
      item['contents'] = await getRepoContents(owner, repo, item.path)
    }
  }

  return result.map(item=>({
    name:item.name,
    path:item.path,
    size:item.size,
    downloadUrl:item.download_url,
    type: item.type,
    contents:item.contents || []
  }))
}

export const getRepoInfo = async (owner:string, repo:string): Promise<Repository> => {
  const url = `https://api.github.com/repos/${owner}/${repo}`
  
  const response = await fetch(url, { headers:{'Authorization':`token ${accessToken}`}})
  const { name, description, topics } = await response.json()
  const languages = await getRepoLanguages(owner, repo)
  const contents = await getRepoContents(owner, repo)

  return {
    name,
    description,
    topics,
    languages,
    contents
  }
}
