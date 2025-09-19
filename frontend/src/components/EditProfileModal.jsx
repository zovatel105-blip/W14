import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { X, Save, User, Camera, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from './AvatarUpload';

const EditProfileModal = ({ isOpen, onClose, onProfileUpdate }) => {
  const { user, updateUser, apiRequest } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    occupation: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        display_name: user.display_name || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [isOpen, user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpdate = (result, avatarUrl) => {
    // Update the form data with the new avatar URL
    setFormData(prev => ({
      ...prev,
      avatar_url: avatarUrl
    }));
    
    toast({
      title: "¡Avatar actualizado!",
      description: "Tu nueva foto de perfil ha sido guardada",
      variant: "default"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty strings and unchanged values
      const updateData = {};
      if (formData.display_name.trim() !== (user.display_name || '')) {
        updateData.display_name = formData.display_name.trim();
      }
      if (formData.bio.trim() !== (user.bio || '')) {
        updateData.bio = formData.bio.trim();
      }
      if (formData.occupation.trim() !== (user.occupation || '')) {
        updateData.occupation = formData.occupation.trim();
      }
      if (formData.avatar_url.trim() !== (user.avatar_url || '')) {
        updateData.avatar_url = formData.avatar_url.trim();
      }

      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Sin cambios",
          description: "No hay cambios que guardar",
          variant: "default"
        });
        setLoading(false);
        return;
      }

      const updatedUser = await updateUser(updateData);

      toast({
        title: "¡Perfil actualizado!",
        description: "Los cambios se han guardado exitosamente",
        variant: "default"
      });
      
      // Notify parent component of the update with the actual updated data
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Check if it's an API error with a detail message
      if (error.message && error.message.includes('API request failed')) {
        toast({
          title: "Error al actualizar",
          description: "Error del servidor. Por favor, intenta de nuevo.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error de conexión",
          description: error.message || "No se pudo conectar con el servidor",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header minimalista */}
        <div className="relative px-6 pt-8 pb-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <h2 className="text-xl font-medium text-gray-900">Tu perfil</h2>
          <p className="text-sm text-gray-500 mt-1">Cuenta tu historia</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          
          {/* Foto de perfil prominente */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Botón circular flotante */}
              <button
                type="button"
                onClick={() => document.getElementById('avatar-upload-input')?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Texto sutil */}
            <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
              Tu primera impresión.<br />Hazla memorable.
            </p>
          </div>

          {/* Input oculto para avatar */}
          <input
            id="avatar-upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Aquí iría la lógica de upload
                const reader = new FileReader();
                reader.onload = (e) => {
                  setFormData(prev => ({
                    ...prev,
                    avatar_url: e.target.result
                  }));
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />

          {/* Nombre - Minimalista */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => handleChange('display_name', e.target.value)}
              placeholder="Tu nombre aquí"
              maxLength={50}
              className="w-full text-lg font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors duration-200 pb-3"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Como apareces para otros</p>
              <p className="text-xs text-gray-400">{formData.display_name.length}/50</p>
            </div>
          </div>

          {/* Biografía - Espacio amplio */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cuéntanos sobre ti
            </label>
            <div className="relative">
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Comparte lo que te apasiona, lo que haces, o simplemente algo interesante sobre ti..."
                maxLength={160}
                rows={4}
                className="w-full text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-gray-100 focus:bg-white border-0 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
              />
              <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                {formData.bio.length}/160
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Exprésate sin límites</p>
          </div>

          {/* Ocupación - Simple */}
          <div className="mb-12">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿A qué te dedicas?
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="Estudiante, Artista, Emprendedor..."
              maxLength={100}
              className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-colors duration-200 pb-3"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Opcional</p>
              <p className="text-xs text-gray-400">{formData.occupation.length}/100</p>
            </div>
          </div>

          {/* Línea separadora sutil */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

          {/* Botones de acción fijos - Tamaño generoso */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 hover:scale-[0.98] active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 hover:scale-[0.98] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Guardando...
                </div>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;