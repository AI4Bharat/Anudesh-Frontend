'use client'

import fetchParams from "@/Lib/fetchParams";


export const getUserProjects = async () => {
  const { url, options } = fetchParams('projects/user-projects/');
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const bookmarkProject = async (projectId) => {
  const { url, options } = fetchParams(`projects/projects/${projectId}/bookmark/`, 'POST');
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Failed to bookmark project');
  return response.json();
};

export const unbookmarkProject = async (projectId) => {
  const { url, options } = fetchParams(`projects/projects/${projectId}/unbookmark/`, 'DELETE');
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Failed to unbookmark project');
  return response.json();
};