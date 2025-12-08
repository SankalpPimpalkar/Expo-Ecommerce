import { Outlet } from "react-router"

export default function DashboardLayout() {
    return (
        <div>
            <h1>Sidebar</h1>
            <h2>Navbar</h2>
            <Outlet />
        </div>
    )
}
