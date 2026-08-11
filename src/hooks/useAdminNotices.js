import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminNotice,
  deleteAdminNotice,
  getAdminNotice,
  getAdminNotices,
  updateAdminNotice,
} from '@/api/adminNoticesApi';

export const ADMIN_NOTICES_KEY = ['adminNotices'];
export const ADMIN_NOTICE_KEY = ['adminNotice'];

export const useAdminNotices = filters =>
  useQuery({
    queryKey: [...ADMIN_NOTICES_KEY, filters],
    queryFn: () => getAdminNotices(filters),
    placeholderData: previous => previous,
  });

export const useAdminNotice = noticeId =>
  useQuery({
    queryKey: [...ADMIN_NOTICE_KEY, noticeId],
    queryFn: () => getAdminNotice(noticeId),
    enabled: Boolean(noticeId),
  });

export const useAdminNoticeActions = () => {
  const queryClient = useQueryClient();
  const invalidateList = () => queryClient.invalidateQueries({ queryKey: ADMIN_NOTICES_KEY });

  const createMutation = useMutation({
    mutationFn: createAdminNotice,
    onSuccess: data => {
      queryClient.setQueryData([...ADMIN_NOTICE_KEY, data.id], data);
      invalidateList();
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateAdminNotice,
    onSuccess: data => {
      queryClient.setQueryData([...ADMIN_NOTICE_KEY, data.id], data);
      invalidateList();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminNotice,
    onSuccess: (_data, noticeId) => {
      queryClient.removeQueries({ queryKey: [...ADMIN_NOTICE_KEY, noticeId] });
      invalidateList();
    },
  });

  return {
    createNotice: createMutation.mutateAsync,
    updateNotice: updateMutation.mutateAsync,
    deleteNotice: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
