"use client";

import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/queries/useProfile";
import useAllUsers from "@/hooks/queries/useAllUsers";

const ProfilePage = () => {
  const { userUid } = useAuth();
  const { data: user, isLoading } = useProfile(userUid);
  const {data: allUsers} = useAllUsers();
  

  return (
    <div className="flex flex-col bg-blue-50 items-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Perfil</h1>

      {isLoading ? (
        <p>Carregando perfil...</p>
      ) : user ? (
        <div className="text-lg">
          <p><strong>Nome:</strong> {user.name || "Nome não disponível"}</p>
          <p><strong>Email:</strong> {user.email || "Email não disponível"}</p>
        </div>
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )};
    </div>
  );
};

export default ProfilePage;



