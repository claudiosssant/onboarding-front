"use client";

import { useState } from "react";
import { addTask, TaskService } from "@/store/services/createTask";
import Button from "@/components/atoms/Button/button";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast } from "@/hooks/useAppToast";
import { errorToast } from "@/hooks/useAppToast";
import { TaskEntity } from "@/common/entities/task";


interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTaskAdded?: () => void;
}

export function Modal({ isOpen, setIsOpen, onTaskAdded }: ModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(name, description);

    const queryClient = useQueryClient();
    
    const addMutation = useMutation(
    async () => {
      try {
        await addTask({
          name,
          description,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log("Tarefa cadastrada com sucesso");
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
       console.log("Tarefa cadastrada com sucesso");
        successToast("Tarefa cadastrada com sucesso");
      },
      onError: () => {
        errorToast("Erro ao cadastrar tarefa. Por favor, tente novamente.");
        setIsSubmitting(false);
      }
    }
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    try {
      addMutation.mutateAsync();
      setIsSubmitting(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Nova Tarefa</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Tarefa
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Máx: 10 caracteres"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              maxLength={10}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-500 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar Tarefa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}