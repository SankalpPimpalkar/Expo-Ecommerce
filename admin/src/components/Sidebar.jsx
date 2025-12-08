import { useUser } from "@clerk/clerk-react"
import { ShoppingBagIcon } from "lucide-react"
import { Link, useLocation } from "react-router"
import { NAVIGATIONS } from "./Navbar"

export default function Sidebar() {

    const location = useLocation()
    const { user } = useUser()

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex flex-col min-h-full items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64">
                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBagIcon className="size-5 text-primary-content" />
                        </div>
                        <span className="text-xl font-bold is-drawer-close:hidden">
                            Admin
                        </span>
                    </div>
                </div>

                <ul className="menu w-full grow flex flex-col gap-2">
                    {
                        NAVIGATIONS.map(nav => {
                            const isActive = location.pathname === nav.path
                            return (
                                <li key={nav.path}>
                                    <Link to={nav.path} className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "bg-primary text-primary-content" : ""}`}>
                                        {nav.icon}
                                        <span className="is-drawer-close:hidden">
                                            {nav.name}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>

                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                            <img src={user.imageUrl} alt={user.fullName} className="size-8 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0 is-drawer-close:hidden">
                            <p className="text-sm font-semibold truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs opacity-60 truncate">
                                {user.emailAddresses[0].emailAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
