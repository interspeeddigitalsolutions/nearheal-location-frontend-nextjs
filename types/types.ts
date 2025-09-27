// =====================================
// ENUMS
// =====================================

export enum JOB_ROLE_TYPE {
  INTERNSHIP = "INTERNSHIP",
  PART_TIME = "PART_TIME",
  ENTRY_LEVEL = "ENTRY_LEVEL",
  ASSOCIATE = "ASSOCIATE",
  MID_SENIOR_LEVEL = "MID_SENIOR_LEVEL",
  MID_LEVEL = "MID_LEVEL",
  SENIOR_LEVEL = "SENIOR_LEVEL",
  DIRECTOR = "DIRECTOR",
  EXECUTIVE = "EXECUTIVE",
}

export enum JOB_LOCATION_TYPE {
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}

export enum JOB_PUBLISH_STATUS {
  PUBLISHED = "PUBLISHED",
  DRAFTED = "DRAFTED",
}

// =====================================
// BASE INTERFACES
// =====================================

export interface ServerFileReference {
  path: string;
  provider: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface JobQuestion {
  _id?: string;
  question: string;
  type: "TEXT" | "MULTIPLE_CHOICE" | "VIDEO" | "FILE_UPLOAD";
  required: boolean;
  options?: string[];
}

// =====================================
// MAIN JOB INTERFACE
// =====================================

export interface Job {
  _id: string;
  title: string;
  thumbnail?: ServerFileReference | null;
  video?: ServerFileReference | null;
  isApproved: boolean;
  isSkipVideoInterview: boolean;
  publishStatus: JOB_PUBLISH_STATUS;
  longDescription?: string | null;
  shortDescription?: string | null;
  salaryRangeMin: number;
  salaryRangeMax: number;

  // Filters
  jobRoleType?: JOB_ROLE_TYPE | null;
  jobLocationType?: JOB_LOCATION_TYPE | null;
  categories?: string[] | null;

  // References
  companyId: string;
  postedBy?: User | null;
}

// =====================================
// PAGINATION TYPES
// =====================================

export interface CommonPaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number | "asc" | "desc"; // -1 for desc, 1 for asc, or string
  filters?: PaginationFilter[];
}

export interface PaginationFilter {
  key: string;
  operator: "eq" | "ne" | "in" | "nin" | "gt" | "gte" | "lt" | "lte" | "regex";
  value: string | number | boolean;
}

export interface PaginationMeta {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  currentPage: number;
  totalPages: number;
}

// =====================================
// RESPONSE TYPES
// =====================================

export interface JobSearchResponse {
  nodes: Job[];
  meta: PaginationMeta;
}

export interface GraphQLJobSearchResponse {
  jobs__searchByCompany: JobSearchResponse;
}

// =====================================
// REQUEST TYPES
// =====================================

export interface SearchJobsByCompanyVariables {
  companyId: string;
  input?: CommonPaginationDto;
}

export interface JobSearchFilters {
  companyId: string;
  jobRoleType?: JOB_ROLE_TYPE;
  jobLocationType?: JOB_LOCATION_TYPE;
  categories?: string[];
  minSalary?: number;
  maxSalary?: number;
  search?: string;
  isApproved?: boolean;
  publishStatus?: JOB_PUBLISH_STATUS;
  pagination?: CommonPaginationDto;
}

// =====================================
// FORM/INPUT TYPES
// =====================================

export interface CreateJobInput {
  title: string;
  shortDescription?: string;
  longDescription?: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  jobRoleType?: JOB_ROLE_TYPE;
  jobLocationType?: JOB_LOCATION_TYPE;
  categories?: string[];
  questions?: JobQuestion[];
  companyId: string;
  thumbnail?: ServerFileReference;
  video?: ServerFileReference;
  lastDayOfApplication?: string;
  isSkipVideoInterview?: boolean;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  _id: string;
  isApproved?: boolean;
  publishStatus?: JOB_PUBLISH_STATUS;
}

// =====================================
// API RESPONSE TYPES
// =====================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination?: PaginationMeta;
}

// =====================================
// HOOK RETURN TYPES
// =====================================

export interface UseJobSearchReturn {
  data: JobSearchResponse | null;
  loading: boolean;
  error: string | null;
  searchJobsByCompany: (
    companyId: string,
    input?: CommonPaginationDto
  ) => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export interface UseJobSearchWithFiltersReturn {
  data: JobSearchResponse | null;
  loading: boolean;
  error: string | null;
  filters: JobSearchFilters;
  setFilters: (filters: Partial<JobSearchFilters>) => void;
  searchWithFilters: (filters: JobSearchFilters) => Promise<void>;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

// =====================================
// COMPONENT PROP TYPES
// =====================================

export interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  onApply?: (jobId: string) => void;
  showCompanyInfo?: boolean;
  compact?: boolean;
}

export interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  error?: string | null;
  onJobClick?: (job: Job) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  emptyMessage?: string;
}

export interface JobSearchFormProps {
  onSearch: (filters: JobSearchFilters) => void;
  loading?: boolean;
  initialFilters?: Partial<JobSearchFilters>;
  hideCompanyFilter?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

// =====================================
// UTILITY TYPES
// =====================================

export type JobStatus =
  | "all"
  | "published"
  | "drafted"
  | "approved"
  | "pending";

export type SortField =
  | "createdAt"
  | "updatedAt"
  | "title"
  | "salaryRangeMin"
  | "salaryRangeMax";

export type SortOrder = "asc" | "desc" | 1 | -1;

// Helper type for partial updates
export type PartialJob = Partial<Job> & { _id: string };

// Helper type for job creation (without server-generated fields)
export type JobInput = Omit<
  Job,
  "_id" | "createdAt" | "updatedAt" | "postedBy" | "applicants"
>;

// =====================================
// TYPE GUARDS
// =====================================

export function isJob(obj: any): obj is Job {
  return (
    obj &&
    typeof obj._id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.salaryRangeMin === "number" &&
    typeof obj.salaryRangeMax === "number" &&
    typeof obj.companyId === "string" &&
    Object.values(JOB_PUBLISH_STATUS).includes(obj.publishStatus)
  );
}

export function isJobSearchResponse(obj: any): obj is JobSearchResponse {
  return (
    obj &&
    Array.isArray(obj.nodes) &&
    obj.nodes.every(isJob) &&
    obj.meta &&
    typeof obj.meta.totalCount === "number" &&
    typeof obj.meta.hasNextPage === "boolean"
  );
}

export function hasValidSalaryRange(job: Partial<Job>): boolean {
  return !!(
    job.salaryRangeMin &&
    job.salaryRangeMax &&
    job.salaryRangeMin <= job.salaryRangeMax
  );
}

// =====================================
// DEFAULT VALUES
// =====================================

export const DEFAULT_PAGINATION: CommonPaginationDto = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: -1,
};

export const DEFAULT_JOB_SEARCH_FILTERS: JobSearchFilters = {
  companyId: "",
  pagination: DEFAULT_PAGINATION,
};

// =====================================
// CONSTANTS
// =====================================

export const JOB_ROLE_TYPE_LABELS: Record<JOB_ROLE_TYPE, string> = {
  [JOB_ROLE_TYPE.INTERNSHIP]: "Internship",
  [JOB_ROLE_TYPE.PART_TIME]: "Part Time",
  [JOB_ROLE_TYPE.ENTRY_LEVEL]: "Entry Level",
  [JOB_ROLE_TYPE.ASSOCIATE]: "Associate",
  [JOB_ROLE_TYPE.MID_SENIOR_LEVEL]: "Mid-Senior Level",
  [JOB_ROLE_TYPE.MID_LEVEL]: "Mid Level",
  [JOB_ROLE_TYPE.SENIOR_LEVEL]: "Senior Level",
  [JOB_ROLE_TYPE.DIRECTOR]: "Director",
  [JOB_ROLE_TYPE.EXECUTIVE]: "Executive",
};

export const JOB_LOCATION_TYPE_LABELS: Record<JOB_LOCATION_TYPE, string> = {
  [JOB_LOCATION_TYPE.ON_SITE]: "On-site",
  [JOB_LOCATION_TYPE.REMOTE]: "Remote",
  [JOB_LOCATION_TYPE.HYBRID]: "Hybrid",
};

export const JOB_PUBLISH_STATUS_LABELS: Record<JOB_PUBLISH_STATUS, string> = {
  [JOB_PUBLISH_STATUS.PUBLISHED]: "Published",
  [JOB_PUBLISH_STATUS.DRAFTED]: "Draft",
};
