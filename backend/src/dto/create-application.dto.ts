export class CreateApplicationDto {
  candidateName: string;
  candidateEmail: string;
  candidateFullName: string;
  position: string;
  cvFilename?: string;
  coverLetter?: string;
}

