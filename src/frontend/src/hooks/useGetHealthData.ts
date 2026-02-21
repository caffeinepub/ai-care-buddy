import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HealthData } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useGetHealthData(user: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HealthData>({
    queryKey: ['healthData', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) throw new Error('Actor or user not available');
      return actor.getHealthData(user);
    },
    enabled: !!actor && !!user && !actorFetching,
    retry: false,
  });
}

