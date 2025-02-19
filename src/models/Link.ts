import { Admin } from "./Admin"
import { Course } from "./Course"
import Order from "./Order"

export interface Link {
    id: number
    monthsArray: number[]
    course: Course
    admin: Admin
    order: Order
}