import { FC } from 'react'
import GenerateLinkForm from '../components/GenerateLinkForm'
import CoursesTable from '../components/CoursesTable'
import { useGetAdminOrdersQuery, useGetCoursesQuery, useGetLinksQuery } from '../api'
import LinksTable from '../components/LinksTable'
import OrdersList from '../components/OrdersTable'
import Navbar from '../components/Navbar'


const ManagerPage: FC = () => {
    const {data: orders} = useGetAdminOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const {data: courses} = useGetCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const {data: links} = useGetLinksQuery(undefined, {
        refetchOnMountOrArgChange: true
    })

    return (
        <div className='flex flex-col space-y-12 p-10'>
            <Navbar/>
            <OrdersList
                orders={orders ?? []}
            />
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <GenerateLinkForm
                    courses={courses ?? []}
                />
                <CoursesTable courses={courses ?? []}/>
                <LinksTable
                    links={links ?? []}
                />
            </div>
        </div>
    )
}

export default ManagerPage