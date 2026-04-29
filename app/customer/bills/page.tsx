import { Card, CardContent } from "@/components/ui/card"
import { getCookies } from "@/helper/cookies"
import { get } from "http"
import Pay from "./pay"

export interface AllBillsResponse {
  success: boolean
  message: string
  data: Bill[]
  count: number
}

export interface Bill {
  id: number
  customer_id: number
  admin_id: number
  month: number
  year: number
  measurement_number: string
  usage_value: number
  price: number
  service_id: number
  paid: boolean
  owner_token: string
  createdAt: string
  updatedAt: string
  service: Service
  admin: Admin
  customer: Customer
  payments: any
  amount: number
  verified_payment: boolean
}

export interface Service {
  id: number
  name: string
  min_usage: number
  max_usage: number
  price: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

/** function to grab all bill based on customer */
async function getAllBills(): Promise<Bill[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/bills/me`
        const response = await fetch(url, {
            method: `GET`,
            headers: {
                "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization":`Bearer ${await getCookies(`token`)}`,
            },
            cache: `no-cache`
        })
        const responseData: AllBillsResponse = await response.json()
        if(!response.ok) {
            console.log(responseData.message)
            return []
        }
        return responseData.data
    } catch (error) {
        console.log("Error fetching bills:", error)
        return []
    }
}

export default async function BillPage() {
    const bills = await getAllBills()
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tagihan Saya</h1>
            {
                bills.length == 0 && 
                    <div className="bg-yellow-100 text-yellow-500 p-4 rounded">
                        Sorry there are no bills to display
                    </div>
            }
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
                {
                    bills.map((bill) => (
                        <Card key={`bill-${bill.id}`}>
                            <CardContent className="flex flex-col">
                                <span className="text-lg font-bold">{bill.amount}</span>
                                <span className="text-sm">Period: {bill.month} {bill.year}</span>
                                <span className="text-sm">Status: {
                                bill.paid ? 
                                bill.verified_payment ? 
                                <span className="px-3 py-1 bg-green-50 text-green-500 border border-green-500 font-semibold rounded-sm">
                                    Payment has verified
                                </span> : 
                            
                                <span className="px-3 py-1 bg-orange-50 text-orange-500 border border-orange-500 font-semibold rounded-sm">
                                    Payment Need Verification
                                </span> :
                                <div className="flex gap-1 items-center">
                                    <span className="px-3 py-1 bg-red-50 text-red-500 border border-red-500 font-semibold rounded-sm">
                                        Payment Unpaid
                                    </span>

                                <Pay />
                                </div>
                                }</span>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}