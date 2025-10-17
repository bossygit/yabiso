import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users, CheckCircle, Edit, Trash2, X } from 'lucide-react';

export default function MouvementCitoyenApp() {
  const [page, setPage] = useState('form'); // 'form', 'success', 'dashboard'
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: '',
    adresse: '',
    telephone: '',
    email: '',
    trancheAge: '',
    lieuResidence: '',
    moisNaissance: '',
    photo: null,
    photoPreview: null
  });

  const tranchesAge = ['18-25 ans', '26-35 ans', '36-45 ans', '46-55 ans', '56 ans et plus'];
  const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom || !formData.sexe || !formData.adresse ||
      !formData.telephone || !formData.email || !formData.trancheAge ||
      !formData.lieuResidence || !formData.moisNaissance) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingMember) {
      // Mode édition
      const updatedMember = {
        ...formData,
        id: editingMember.id,
        dateInscription: editingMember.dateInscription
      };
      setMembers(prev => prev.map(member =>
        member.id === editingMember.id ? updatedMember : member
      ));
      setEditingMember(null);
      setPage('dashboard');
    } else {
      // Mode création
      const newMember = {
        ...formData,
        id: Date.now(),
        dateInscription: new Date().toLocaleDateString('fr-FR')
      };
      setMembers(prev => [...prev, newMember]);
      setPage('success');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      sexe: '',
      adresse: '',
      telephone: '',
      email: '',
      trancheAge: '',
      lieuResidence: '',
      moisNaissance: '',
      photo: null,
      photoPreview: null
    });
    setEditingMember(null);
    setPage('form');
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      nom: member.nom,
      prenom: member.prenom,
      sexe: member.sexe,
      adresse: member.adresse,
      telephone: member.telephone,
      email: member.email,
      trancheAge: member.trancheAge,
      lieuResidence: member.lieuResidence,
      moisNaissance: member.moisNaissance,
      photo: member.photo,
      photoPreview: member.photoPreview
    });
    setPage('form');
  };

  if (page === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#007FFF' }}>
            Merci et Bienvenue !
          </h1>
          <p className="text-gray-700 mb-2 text-lg">
            Votre inscription a été enregistrée avec succès.
          </p>
          <p className="text-gray-600 mb-6">
            Un email de confirmation a été envoyé à <span className="font-semibold">{formData.email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#007FFF' }}
            >
              Nouvelle inscription
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#FFD700', color: '#000' }}
            >
              Voir les membres
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold" style={{ color: '#007FFF' }}>
                Membres du Mouvement
              </h1>
              <button
                onClick={() => setPage('form')}
                className="px-4 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: '#007FFF' }}
              >
                + Nouveau membre
              </button>
            </div>
            <p className="text-gray-600">Total: {members.length} membre(s)</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg p-6 border-t-4" style={{ borderColor: '#FFD700' }}>
                <div className="flex items-start gap-4 mb-4">
                  {member.photoPreview ? (
                    <img src={member.photoPreview} alt="Profil" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: '#007FFF' }}>
                      {member.prenom[0]}{member.nom[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{member.prenom} {member.nom}</h3>
                    <p className="text-sm text-gray-600">{member.sexe}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" style={{ color: '#007FFF' }} />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" style={{ color: '#007FFF' }} />
                    <span>{member.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" style={{ color: '#007FFF' }} />
                    <span>{member.lieuResidence}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" style={{ color: '#007FFF' }} />
                    <span>{member.trancheAge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" style={{ color: '#007FFF' }} />
                    <span>Né(e) en {member.moisNaissance}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-gray-500 flex justify-between items-center">
                  <span>Inscrit le {member.dateInscription}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="p-2 rounded-lg text-white hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#007FFF' }}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 rounded-lg text-white hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#DC2626' }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">Aucun membre enregistré pour le moment</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b-4" style={{ borderColor: '#FFD700' }}>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#007FFF' }}>
              Mouvement Citoyen Congolais
            </h1>
            <p className="text-gray-600 text-lg">
              {editingMember ? 'Modifier les informations du membre' : 'Formulaire d\'adhésion'}
            </p>
            {editingMember && (
              <button
                onClick={() => {
                  setEditingMember(null);
                  resetForm();
                }}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#6B7280' }}
              >
                <X className="w-4 h-4 inline mr-1" />
                Annuler
              </button>
            )}
          </div>

          <div className="p-8">
            {/* Photo de profil */}
            <div className="mb-8 text-center">
              <label className="block mb-4">
                <div className="mx-auto w-32 h-32 rounded-full border-4 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: '#FFD700' }}>
                  {formData.photoPreview ? (
                    <img src={formData.photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl" style={{ backgroundColor: '#007FFF' }}>
                      <User />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer" style={{ backgroundColor: '#007FFF' }}>
                  Choisir une photo
                </span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              {/* Sexe */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Sexe *
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>

              {/* Tranche d'âge */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Tranche d'âge *
                </label>
                <select
                  name="trancheAge"
                  value={formData.trancheAge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="">Sélectionner</option>
                  {tranchesAge.map(tranche => (
                    <option key={tranche} value={tranche}>{tranche}</option>
                  ))}
                </select>
              </div>

              {/* Mois de naissance */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Mois de naissance *
                </label>
                <select
                  name="moisNaissance"
                  value={formData.moisNaissance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="">Sélectionner</option>
                  {mois.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Adresse *
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              {/* Lieu de résidence */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2" style={{ color: '#007FFF' }}>
                  Ville de résidence *
                </label>
                <input
                  type="text"
                  name="lieuResidence"
                  value={formData.lieuResidence}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: '#007FFF' }}
              >
                {editingMember ? 'Mettre à jour' : 'S\'inscrire'}
              </button>
              {members.length > 0 && (
                <button
                  onClick={() => setPage('dashboard')}
                  className="px-6 py-4 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#FFD700', color: '#000' }}
                >
                  Voir les membres
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
