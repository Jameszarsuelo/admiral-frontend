import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { DataTable } from '@/components/ui/DataTable';
import Spinner from '@/components/ui/spinner/Spinner';
import { fetchViewMember } from '@/database/profile_api';
import { IUserProfile } from '@/types/ProfileSchema';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const ProfileView = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const {data: profileView, isLoading, refetch} = useQuery<IUserProfile[]>({
    queryKey:['profile-view', id],
    queryFn: ({ queryKey }) => fetchViewMember(queryKey[1] as number),
    staleTime:500,
   });


   const columns: ColumnDef<IUserProfile>[] = [
    {accessorKey: 'id', header:'ID'},
    {accessorKey: 'firstname', header:'Firstname'},
    {accessorKey: 'lastname', header:'Lastname'},
    {accessorKey: 'organization', header:'Organization'},
    {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original as IUserProfile;
                return (
                    <div className="flex items-center gap-2">
                         {<Button size="sm" variant="info" onClick={() => navigate(`/profiles/view/${item.id}`)}>
                                View Members
                            </Button>}
                    </div>
                );
            },
        },
   ]


  return (
    <>
            <PageBreadcrumb pageTitle="View Members" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Profile View Member</h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Manage application profile view member.</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                           <Button size="sm" onClick={() => navigate(`/profiles`)}>
                                   Back
                                </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[700px] xl:min-w-full px-2">
                            {!isLoading && profileView ? (
                                <DataTable columns={columns} data={profileView} />
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default ProfileView
