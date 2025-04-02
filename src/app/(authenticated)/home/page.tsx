"use client";

import { useState, useCallback } from "react";
import { useAllTasks } from "@/hooks/queries/useTask";
import { addTask, deleteTask, TaskService } from "@/store/services/createTask";
import Button from "@atoms/Button/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Modal } from "@/components/atoms/Modal/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast } from "@/hooks/useAppToast";
import { errorToast } from "@/hooks/useAppToast";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasks, isLoading } = useAllTasks();
  const queryClient = useQueryClient();

  const deletedMutation = useMutation(
    async (taskId: string) => {
      try {
        await deleteTask(taskId);
      } 
      
      catch (error) {
        console.error("Axis registration error:", error);
        errorToast("Erro ao cadastrar tarefa. Por favor, tente novamente.");
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks"]
        });
        successToast("Tarefa deletada com sucesso");
      },
      onError: () => {
        errorToast("Erro ao deletar tarefa. Por favor, tente novamente.");
      }
    }
  );

  const handleDeleteTask = async (taskId: string) => {
    console.log(taskId);
    await deletedMutation.mutateAsync(taskId);
  };

  return (
    <div className="flex flex-col items-center gap-20 justify-center w-full h-screen">
      <h1 className="text-4xl font-bold">LISTA DE TAREFAS</h1>

      <Button className="bg-white font-bold" onClick={() => setIsModalOpen(true)}>
        <PlusIcon className="w-6 h-6 bg-black text-white rounded-full p-1" />
        Adicionar Tarefa
      </Button>

      {isLoading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <div className="w-1/2 bg-gray-50 p-4 border rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tarefas Cadastradas</h2>
          {tasks?.length ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.uid} className="p-3 border-b">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-lg">{task.name}</span>
                    <Button className="bg-red-500 rounded-full text-white p-3" onClick={() => handleDeleteTask(task.uid)}>
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm ml-2">{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma tarefa cadastrada.</p>
          )}
        </div>
      )}

       <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}