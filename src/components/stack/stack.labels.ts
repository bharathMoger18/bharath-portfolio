import type { StackCategory, UsedIn } from '../../data/types.ts';

/** UI labels for the filter tabs and used-in marks. Structure, not claims. */
export const CATEGORY_ORDER: readonly StackCategory[] = [
  'containers',
  'cicd-iac',
  'cloud',
  'observability-security',
  'systems',
] as const;

export const CATEGORY_LABEL: Record<StackCategory, string> = {
  containers: 'Containers',
  'cicd-iac': 'CI/CD and IaC',
  cloud: 'Cloud',
  'observability-security': 'Observability and Security',
  systems: 'Systems',
};

export const USED_IN_LABEL: Record<UsedIn, string> = {
  kubeadm: 'Used in the kubeadm project',
  aws: 'Used in the AWS project',
  learning: 'Learning',
};

/** One-letter tile marks. Always paired with a legend and the tile's accessible name. */
export const USED_IN_MARK: Record<UsedIn, string> = {
  kubeadm: 'K',
  aws: 'A',
  learning: 'L',
};

export function usedInText(usedIn: UsedIn[]): string {
  return usedIn.map((u) => USED_IN_LABEL[u]).join(', ');
}
