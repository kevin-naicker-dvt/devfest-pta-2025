export interface User {
  name: string;
  email: string;
  fullName: string;
  role: 'applicant' | 'recruiter';
}

export interface Application {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidateFullName: string;
  position: string;
  cvFilename?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'rejected'
  | 'accepted';

export interface ApplicationStats {
  total: number;
  byStatus: {
    submitted: number;
    underReview: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
}

