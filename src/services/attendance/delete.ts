import { axiosApi } from "@/libs/axios";
import { queryClient } from "@/libs/react-query";
import { useMutation } from "react-query";



export const deleteAttendance = async (id: number) => {
  const res = await axiosApi.delete(`/attendance/${id}`);
  return res.data;
};

export const useDeleteAttendance = (id: number) => {
  return useMutation({
    mutationFn: () => deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};