import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EmergencyContact } from '../backend';
import { toast } from 'sonner';

export function useAddEmergencyContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: EmergencyContact) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEmergencyContact(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      toast.success('Emergency contact added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add emergency contact. Please try again.');
      console.error('Error adding emergency contact:', error);
    },
  });
}

