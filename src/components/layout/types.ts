/** Layout-level prop types. Owner: Account A. */

export interface NavItem {
  /** Section id on the home page, e.g. "about". Link target is "/#about". */
  id: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  /** Plain file download (e.g. the resume PDF). */
  download?: boolean;
}
