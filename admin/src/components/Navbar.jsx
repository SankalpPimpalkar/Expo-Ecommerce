import { ClipboardPasteIcon, HomeIcon, PanelLeftIcon, ShoppingBagIcon, UsersIcon } from "lucide-react"
import { useLocation } from "react-router"
import { UserButton } from "@clerk/clerk-react"

export const NAVIGATIONS = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="size-5" /> },
    { name: 'Products', path: '/products', icon: <ShoppingBagIcon className="size-5" /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardPasteIcon className="size-5" /> },
    { name: 'Customers', path: '/customers', icon: <UsersIcon className="size-5" /> },
]

export default function Navbar() {

    const location = useLocation()

    return (
        <div className="navbar w-full bg-base-300">
            <label aria-label="open sidebar" htmlFor="my-drawer" className="btn btn-square btn-ghost">
                <PanelLeftIcon className="size-5" />
            </label>
            <div className="flex-1 px-4">
                <h1 className="text-xl font-bold">
                    {
                        NAVIGATIONS.find(nav => nav.path === location.pathname)?.name
                    }
                </h1>
            </div>
            <div className="mr-5">
                <UserButton />  
            </div>
        </div>
    )
}
