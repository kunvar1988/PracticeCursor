/**
 * Utility functions for interacting with GitHub repositories.
 */

/**
 * Parses a GitHub URL to extract owner and repo name.
 * 
 * @param {string} githubUrl - The URL of the GitHub repository, e.g., https://github.com/owner/repo
 * @returns {{ owner: string, repo: string } | null} Object with owner and repo, or null if invalid
 */
export function parseGitHubUrl(githubUrl: string): { owner: string; repo: string } | null {
  try {
    // Parse the GitHub repository owner and name from the URL
    // Supports URLs like: https://github.com/owner/repo, with or without trailing slash
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      return null;
    }
    return {
      owner: match[1],
      repo: match[2]
    };
  } catch (e) {
    return null;
  }
}

/**
 * Fetches the README.md content for a given GitHub repository URL.
 * 
 * @param {string} githubUrl - The URL of the GitHub repository, e.g., https://github.com/owner/repo
 * @returns {Promise<string | null>} The README content as plain text, or null if not found/error.
 */
export async function getReadmeContent(githubUrl: string): Promise<string | null> {
  try {
    const repoInfo = parseGitHubUrl(githubUrl);
    if (!repoInfo) {
      return null;
    }

    // Try main and master branches in parallel
    const branches = ['main', 'master'];
    const requests = branches.map(branch => {
      const rawUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/README.md`;
      return fetch(rawUrl).then(async (response) => {
        if (response.ok) {
          const content = await response.text();
          return { success: true, content };
        }
        return { success: false, content: null };
      }).catch(() => ({ success: false, content: null }));
    });

    // Wait for all requests to complete and use the first successful one
    const results = await Promise.all(requests);
    const successfulResult = results.find(result => result.success);
    
    if (successfulResult) {
      return successfulResult.content;
    }
    
    // If not found in either branch, return null
    return null;
  } catch (e) {
    // Log error only in development for debugging
    // console.error("Error fetching README.md:", e);
    return null;
  }
}

/**
 * Fetches repository metadata from GitHub API, including star count, website URL, and license.
 * 
 * @param {string} owner - The repository owner
 * @param {string} repo - The repository name
 * @returns {Promise<{ stars: number; websiteUrl: string | null; license: string | null } | null>} Object with stars, websiteUrl, and license, or null if error
 */
export async function getRepoMetadata(owner: string, repo: string): Promise<{ stars: number; websiteUrl: string | null; license: string | null } | null> {
  try {
    // Use GitHub REST API to fetch repo information
    // No authentication needed for public repos, but rate limited to 60 requests/hour
    // If you have a GitHub token, you can add it to headers for higher rate limits
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Optional: Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      stars: data.stargazers_count ?? 0,
      websiteUrl: data.homepage || null,
      license: data.license?.spdx_id || data.license?.name || null
    };
  } catch (e) {
    return null;
  }
}

/**
 * Fetches the latest version/release from GitHub API.
 * 
 * @param {string} owner - The repository owner
 * @param {string} repo - The repository name
 * @returns {Promise<string | null>} The latest version tag, or null if error/not found
 */
export async function getLatestVersion(owner: string, repo: string): Promise<string | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Optional: Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch latest release and tags in parallel
    const [releaseResponse, tagsResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/tags`, { headers })
    ]);

    // Check release first (preferred)
    if (releaseResponse.ok) {
      const releaseData = await releaseResponse.json();
      if (releaseData.tag_name) {
        return releaseData.tag_name;
      }
    }

    // Fallback to tags if release not found
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      if (Array.isArray(tagsData) && tagsData.length > 0) {
        return tagsData[0].name;
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Fetches comprehensive repository information including stars, latest version, website URL, and license.
 * 
 * @param {string} githubUrl - The URL of the GitHub repository, e.g., https://github.com/owner/repo
 * @returns {Promise<{ stars: number | null; latestVersion: string | null; websiteUrl: string | null; license: string | null } | null>} Object with stars, latestVersion, websiteUrl, and license, or null if error
 */
export async function getRepoInfo(githubUrl: string): Promise<{ stars: number | null; latestVersion: string | null; websiteUrl: string | null; license: string | null } | null> {
  try {
    const repoInfo = parseGitHubUrl(githubUrl);
    if (!repoInfo) {
      return null;
    }

    // Fetch repo metadata and latest version in parallel
    const [repoMetadata, latestVersion] = await Promise.all([
      getRepoMetadata(repoInfo.owner, repoInfo.repo),
      getLatestVersion(repoInfo.owner, repoInfo.repo)
    ]);

    return {
      stars: repoMetadata?.stars ?? null,
      latestVersion: latestVersion ?? null,
      websiteUrl: repoMetadata?.websiteUrl ?? null,
      license: repoMetadata?.license ?? null
    };
  } catch (e) {
    return null;
  }
}

