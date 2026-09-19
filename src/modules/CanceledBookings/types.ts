export interface CancellationItem {
  id: string;
  postId: string;
  date: string;
  pickupLocation: string;
  dropLocation: string;
  status: 'Pending' | 'Paid';
  reason: string;
  cancellationCharge: number;
}

export interface OtherDueDetails {
  pendingCharges: number;
  cancellationDetails: CancellationItem[];
}