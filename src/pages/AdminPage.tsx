import { FC, useEffect } from 'react'
import { useGetAdminsQuery, useGetAllLinksQuery, useGetCoursesQuery, useGetOrdersQuery } from '../api'
import OrdersList from '../components/OrdersTable';
import GenerateLinkForm from '../components/GenerateLinkForm';
import AddCourse from '../components/AddCourse';
import CoursesTable from '../components/CoursesTable';
import LinksTable from '../components/LinksTable';
import CreateAdmin from '../components/CreateAdmin';
import AdminsTable from '../components/AdminsTable';
import Navbar from '../components/Navbar';


const AdminPage: FC = () => {
    const {data: orders} = useGetOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const {data: courses} = useGetCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const {data: links} = useGetAllLinksQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const {data: admins} = useGetAdminsQuery(undefined, {
        refetchOnMountOrArgChange: true
    })

    useEffect(() => {
        console.log(orders)
    }, [orders])  

    return (
        <div className='flex flex-col space-y-10 p-10'>
            <Navbar/>
            <OrdersList
                orders={orders ?? []}
            />
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <CreateAdmin/>
                <AdminsTable
                    admins={admins ?? []}
                />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <AddCourse/>
                <CoursesTable
                    courses={courses ?? []}
                />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <GenerateLinkForm
                    courses={courses ?? []}
                />
                <LinksTable
                    showAdminName={true}
                    links={links ?? []}
                />
            </div>
        </div>
    )
}

export default AdminPage