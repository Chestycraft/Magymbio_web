import MembersTable from "@/app/components/tablecomponent";
import AdminTable from "@/app/components/admin/adminTable";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="p-0">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">Manage all MAGYMBO members in one place</p>
          <div className="mb-6 h-1 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <MembersTable />
      <AdminTable/>
        </div>
      </div>
    </div>
  );
}
