import {useMemo} from 'react';
import {OtherDueDetails} from '../types';

const useOtherDueDetails = () => {
  const data = useMemo<OtherDueDetails>(() => {
    return {
      pendingCharges: 200,

      cancellationDetails: [
        {
          id: '1',
          postId: '12345678',
          date: '29 Aug 2026, 10:00 AM',
          pickupLocation: 'Bhandup Mumbai, Maharashtra',
          dropLocation: 'Rajkot Mandi, Gujarat, India',
          status: 'Pending',
          reason: 'Cancelled By You',
          cancellationCharge: 100,
        },
        {
          id: '2',
          postId: '12345678',
          date: '29 Aug 2026, 10:00 AM',
          pickupLocation: 'Bhandup Mumbai, Maharashtra',
          dropLocation: 'Rajkot Mandi, Gujarat, India',
          status: 'Pending',
          reason: 'Cancelled By You',
          cancellationCharge: 100,
        },
      ],
    };
  }, []);

  return {
    data,
    pendingCharges: data.pendingCharges,
    cancellationDetails: data.cancellationDetails,
    isLoading: false,
    isError: false,
  };
};

export default useOtherDueDetails;