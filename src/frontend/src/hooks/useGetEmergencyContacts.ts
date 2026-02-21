import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EmergencyContact } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useGetEmergencyContacts(user: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EmergencyContact[]>({
    queryKey: ['emergencyContacts', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) throw new Error('Actor or user not available');
      return actor.getEmergencyContacts(user);
    },
    enabled: !!actor && !!user && !actorFetching,
    retry: false,
  });
}

