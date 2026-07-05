export type CrafterStatus = "Pending" | "Active" | "Rejected" | "Suspended";

export interface PortfolioItem {
  id: string;
  imageUrl: string;   // placeholder path
  caption: string;
}

export interface CrafterApplication {
  id: string;              // CID
  ownerName: string;       // real name of applicant
  ownerEmail: string;
  storeName: string;
  storeDescription: string;
  location: string;
  category: string;        // main craft category
  submittedAt: string;     // ISO date string
  status: CrafterStatus;
  lastActive: string;      // ISO date string

  // Verification documents
  ktpImageUrl: string;     // ID card photo path
  selfieWithKtpUrl: string;
  storeAddress: string;
  phoneNumber: string;

  // Portfolio
  portfolio: PortfolioItem[];

  // Social links (optional)
  instagramUrl?: string;
  shopeeUrl?: string;

  // Admin notes after review
  adminNote?: string;
  reviewedAt?: string;
}
