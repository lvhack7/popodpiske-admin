import { Link } from "./Link"
import { Payment } from "./Payment"
import { User } from "./User";

export default interface Order {
    id: number
    courseName: string;
    totalPrice: number;
    numberOfMonths: number;
    monthlyPrice: number;
    nextBillingDate: string;
    recurrentToken?: string; // dont show it
    remainingMonth: number;
    status: string
    link: Link
    user: User
    payments: Payment[]
}