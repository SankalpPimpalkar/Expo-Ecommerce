import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function DashboardLayout() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" className="drawer-toggle" type="checkbox" defaultChecked />
            <div className="drawer-content">
                <Navbar />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
            <Sidebar />
        </div>
    )
}
