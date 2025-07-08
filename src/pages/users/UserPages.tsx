// src/pages/users/UsersPage.tsx
import { useState } from "react";
import UsersList from "./UserList";
import NewUser from "./NewUser"

export default function UsersPage() {
  const [tab, setTab] = useState<'list' | 'new'>('list');

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab('list')}
            className={`py-4 px-1 border-b-2 font-medium ${
              tab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Listado
          </button>
          <button
            onClick={() => setTab('new')}
            className={`py-4 px-1 border-b-2 font-medium ${
              tab === 'new' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Nuevo Usuario
          </button>
        </nav>
      </div>
      <div>
        {tab === 'list' && <UsersList />}
        {tab === 'new' && <NewUser onSuccess={() => setTab('list')} />}
      </div>
    </div>
  )
};
