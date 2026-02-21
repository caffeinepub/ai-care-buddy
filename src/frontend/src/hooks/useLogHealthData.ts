import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HealthData } from '../backend';
import { toast } from 'sonner';

export function useLogHealthData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HealthData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logHealthData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthData'] });
      toast.success('Health data logged successfully!');
    },
    onError: (error) => {
      toast.error('Failed to log health data. Please try again.');
      console.error('Error logging health data:', error);
    },
  });
}

