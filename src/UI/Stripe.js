import { useQuery } from 'react-query';
import { loadStripe } from '../dependencies';

export const useStripe = ({ onSuccess } = {}) => {
  const { data: stripe, isLoading } = useQuery(
    'STRIPE',
    () =>
      loadStripe(
        'pk_test_51I2KgoFsTTaGQznwH6cphvxjQlnZsfjyYc3iyZMcsQOsVcITYdjpuqS9leDagO6D7qSSaqiMshELJnBmGRNmmZb20010kOgar8'
      ),
    {
      onSuccess,
      refetchOnMount: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return { stripe, isLoading };
};
