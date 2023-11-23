import useAuth from './useAuth';
import { Navigate, useParams } from 'react-router-dom';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import ClassRoomService from '@/services/ClassService';
import { ClassRoom } from '@/app/store/server/features/classroom/interfaces';

export default function useGetDetailClass(): any {
    const {id} = useParams();
    if (!id) {
        return <Navigate to="/" />;
    }
    // const { isLoading, data, isError, error} = useClassRoomByUserId(user_id)
    const queryData = useQuery({
      queryKey: ['classes'],
      queryFn: () => ClassRoomService.getClassDetail(id),
      retry: false,
    });

    return queryData;
}
