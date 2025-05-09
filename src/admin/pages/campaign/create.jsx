import React, { useEffect, useState } from 'react';
import DefaultAdminLayout from '../../layout/DefaultAdminLayout';
import { useData } from '../../../contexts/DataContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormLayout from '../../layout/DefaultFormLayout';
import FileInput from '../../components/Inputs/file';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm';
import { HandCoins } from "lucide-react";
import DonationsPopUp from '../../components/Cards/donation-popup';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function CreateAdminCampaigns() {
  const data = useData();
  const { id } = useParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { user = null } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [itemToEditLoaded, setItemToEditLoaded] = useState(false);
  let required_data = ['specialty_categories'];
  const [verified_inputs, setVerifiedInputs] = useState([]);
  const [valid, setValid] = useState(false);
  const [donationPopUpOpen, setDonationPopUpOpen] = useState(false);
  const [updateDonationCount, setUpdateDonationCount] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [campaignImages, setCampaignImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [imageTitles, setImageTitles] = useState({});

  let initial_form = {
    title_pt: "",
    title_en: "",
    image_filename: "",
    location: "",
    date: "",
    description_pt: "",
    description_en: "",
    goal: "",
    report_link: "",
    goal_pt: "",
    goal_en: "",
    youtube_link: '',
    raised: "",
    insert_amount_raised_manually: false
  };

  const [form, setForm] = useState(initial_form);

  function handleUploadedFiles(upload) {
    setForm({ ...form, [upload.key]: upload.filename });
  }

  useEffect(() => {
    let v = true;

    if (
      !form.title_pt ||
      !form.title_en ||
      !form.image_filename ||
      !form.location ||
      !form.date ||
      !form.description_pt ||
      !form.description_en ||
      (form.insert_amount_raised_manually && !form.raised)
    ) {
      v = false;
      v = [];
    }

    setValid(v);
  }, [form]);

  // Fetch campaign images when editing
  useEffect(() => {
    if (id) {
      const fetchCampaignImages = async () => {
        try {
          const response = await data.makeRequest({
            method: 'get',
            url: `api/campaign-images/${id}`,
            withToken: true,
            error: ''
          }, 100);
          setCampaignImages(response.data || []);
          
          // Initialize titles
          const titles = {};
          response.data.forEach(img => {
            titles[img.id] = {
              title_pt: img.title_pt || '',
              title_en: img.title_en || ''
            };
          });
          setImageTitles(titles);
        } catch (error) {
          console.error('Error fetching campaign images:', error);
        }
      };
      fetchCampaignImages();
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImages(true);
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('campaign_id', id);

      const response = await axios.post(`${data.APP_BASE_URL}/api/upload-campaign-image`, formData);

      setCampaignImages(prev => [...prev, response.data]);
      setImageTitles(prev => ({
        ...prev,
        [response.data.id]: {
          title_pt: '',
          title_en: ''
        }
      }));
      toast.success('Imagem adicionada com sucesso!');
      setLoading(false)
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Erro ao enviar imagem!');
    } finally {
      setUploadingImages(false);
      setLoading(false)
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {

      setLoading(true)
      await data.makeRequest({
        method: 'post',
        url: `api/delete-campaign-image/${imageId}`,
        withToken: true,
        error: ''
      }, 0);

      setCampaignImages(prev => prev.filter(img => img.id !== imageId));
      
      // Remove title from state
      const newTitles = { ...imageTitles };
      delete newTitles[imageId];
      setImageTitles(newTitles);
      
      toast.success('Imagem removida com sucesso!');
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Failed to delete image:', error);
      toast.error('Erro ao excluir imagem!');
    }
  };

  const startEditing = (id) => {
    setEditingImageId(id);
  };

  const cancelEditing = () => {
    setEditingImageId(null);
  };

  const saveTitle = async (imageId) => {
    try {
      setLoading(true)
      await data.makeRequest({
        method: 'post',
        url: `api/update-campaign-image-title/${imageId}`,
        withToken: true,
        data: {
          title_pt: imageTitles[imageId]?.title_pt || '',
          title_en: imageTitles[imageId]?.title_en || ''
        },
        error: ''
      }, 0);

      // Update local images state
      setCampaignImages(prev => prev.map(img => 
        img.id === imageId ? { 
          ...img, 
          title_pt: imageTitles[imageId]?.title_pt || '', 
          title_en: imageTitles[imageId]?.title_en || '' 
        } : img
      ));
      
      setEditingImageId(null);
      toast.success('Títulos atualizados com sucesso!');
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Failed to update title:', error);
      toast.error('Erro ao atualizar títulos!');
    }
  };

  const handleTitleChange = (imageId, field, value) => {
    setImageTitles(prev => ({
      ...prev,
      [imageId]: {
        ...prev[imageId],
        [field]: value
      }
    }));
  };

  async function SubmitForm() {
    
    setLoading(true);

    try {
      let form_data = {
        ...form
      };

      if (id) {
        let r = await data.makeRequest({ method: 'post', url: `api/campaign/` + id, withToken: true, data: form_data, error: `` }, 0);
        setForm({ ...form, r });
        toast.success('Actualizado com sucesso');
        setLoading(false);
      } else {
        let response = await data.makeRequest({ method: 'post', url: `api/campaign/`, withToken: true, data: form_data, error: `` }, 0);
        console.log({ response });
        toast.success('Adicionado com sucesso!');
        setForm(initial_form);
        setLoading(false);
        setVerifiedInputs([]);
      }
    } catch (e) {
      let msg = "Acorreu um erro, tente novamente";
      console.log(e);
      setLoading(false);

      if (e.response) {
        if (e.response.status == 409) {
          msg = "Titulo já existe";
        }
        if (e.response.status == 400) {
          msg = "Dados inválidos";
        }
        if (e.response.status == 500) {
          msg = "Erro, inesperado. Contacte seu administrador";
        }
      } else if (e.code == 'ERR_NETWORK') {
        msg = "Verfique sua internet e tente novamente";
      }

      toast.error(msg);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user || !id) {
      return;
    }

    (async () => {
      try {
        let response = await data.makeRequest({ method: 'get', url: `api/campaign/` + id, withToken: true, error: `` }, 0);
        setItemToEditLoaded(response);
        if (form.id) {
          setForm({ ...form, donations: response.donations });
        } else {
          setForm({ ...response });
        }
        setLoading(false);
      } catch (e) {
        console.log({ e });
        let msg = "Acorreu um erro, tente novamente";
        setLoading(false);

        console.log({ aaaaa: e.response.status });

        if (e.response) {
          if (e.response.status == 409) {
            msg = "Email já existe";
          }

          if (e.response.status == 404) {
            msg = "Item não encontrado";
            navigate('/dashboard');
          }
          if (e.response.status == 500) {
            msg = "Erro, inesperado. Contacte seu administrador";
          }
        } else if (e.code == 'ERR_NETWORK') {
          msg = "Verfique sua internet e tente novamente";
        }
        toast.remove();
        toast.error(msg);
      }
    })();
  }, [user, pathname, updateDonationCount]);

  const [itemToShow, setItemToShow] = useState(null);

  useEffect(() => {
    if (!itemToShow && donationPopUpOpen) {
      setDonationPopUpOpen(false);
      setUpdateDonationCount(Math.random());
      setItemToEditLoaded(null);
    }
  }, [itemToShow]);

  return (
    <>
     {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3 shadow-xl">
              <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
              <span>Processando...</span>
            </div>
          </div>
      )}
      <DonationsPopUp setItemToShow={setItemToShow} show={Boolean(itemToShow)} itemToShow={itemToShow} />

      <DefaultAdminLayout>
        <div class="pt-6 px-4">
          {!itemToEditLoaded && id && <div className="mt-10">
            <DefaultFormSkeleton />
          </div>}
          <FormLayout hide={!itemToEditLoaded && id} title={id ? 'Editar campanha' : 'Adicionar campanha'} verified_inputs={verified_inputs} form={form}
            topBarContent={(
              <div className={`${loading || !id ? 'hidden' : ''}`}>
                <button onClick={() => {
                  setDonationPopUpOpen(true);
                  setItemToShow({
                    name: 'donations',
                    ...form,
                    update_id: null
                  })
                }}
                  type="button" class={`text-white ${form.insert_amount_raised_manually ? 'bg-orange-300' : 'bg-honolulu_blue-400'} max-sm:w-full border focus:ring-4 focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2`}>
                  <HandCoins size={20} />
                  <span className="ml-2">Doações</span>
                  {(form.donations?.length != 0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                    {form.donations?.length}
                  </div>}
                </button>
              </div>
            )}
            bottomContent={(
              <div>
                <div className="flex flex-col gap-x-4 flex-wrap mt-4">
                  {(form.id || !id) && <FileInput onlyImages={true} _upload={{ key: 'image_filename', filename: form.image_filename }} res={handleUploadedFiles} label={'Imagem principal'} r={true} />}
                  <div className="max-w-[500px] flex items-center justify-center bg-gray-300 h-[150px] rounded-[0.3rem]">
                    {!form.image_filename && <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                    </svg>}
                    {form.image_filename && <img className="object-cover border w-auto h-full" src={data.APP_BASE_URL + "/file/" + form.image_filename?.replaceAll(' ', '%20')} />}
                  </div>
                </div>

                {/* Gallery Images Section */}
                {id && (
                  <div className="mt-8">
                     <h3 className="text-sm font-semibold mb-4">Imagens da campanha</h3>
                    {/* Upload new image */}
                    <div className="mb-4">
                      <input
                        accept={['.jpg', '.jpeg', '.png', '.gif', '.bmp']}
                        id="campaign-images-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                      <label
                        htmlFor="campaign-images-upload"
                        className={`inline-flex items-center px-4 py-2 bg-honolulu_blue-300 text-white rounded-[0.3rem] cursor-pointer hover:bg-honolulu_blue-500 transition ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploadingImages ? 'Enviando...' : 'Adicionar Imagem'}
                      </label>
                    </div>

                    {/* Gallery images grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {campaignImages.map((image) => (
                        <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md bg-white">
                          <img
                            src={`${data.APP_BASE_URL}/file/${image.url?.replaceAll(' ', '%20')}`}
                            alt="Campanha"
                            className="w-full h-48 object-cover"
                          />
                          
                          {/* Image actions */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                              title="Remover"
                            >
                              <FaTrash size={12} />
                            </button>
                            <button
                              onClick={() => startEditing(image.id)}
                              className="bg-blue-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                              title="Editar título"
                            >
                              <FaEdit size={12} />
                            </button>
                          </div>
                          
                          {/* Title display/edit area */}
                          <div className="p-3">
                            {editingImageId === image.id ? (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={imageTitles[image.id]?.title_pt || ''}
                                  onChange={(e) => handleTitleChange(image.id, 'title_pt', e.target.value)}
                                  className="border border-gray-300 p-2 rounded-md w-full text-sm"
                                  placeholder="Título (pt)"
                                />
                                <input
                                  type="text"
                                  value={imageTitles[image.id]?.title_en || ''}
                                  onChange={(e) => handleTitleChange(image.id, 'title_en', e.target.value)}
                                  className="border border-gray-300 p-2 rounded-md w-full text-sm"
                                  placeholder="Título (en)"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={cancelEditing}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                  >
                                    <FaTimes />
                                  </button>
                                  <button
                                    onClick={() => saveTitle(image.id)}
                                    className="text-green-500 hover:text-green-700 text-sm"
                                  >
                                    <FaSave />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center min-h-[20px]">
                                {image.title_pt || image.title_en ? (
                                  <div>
                                    <p className="font-medium text-sm">
                                      {(image.title_pt || image.title_en) || <span className="text-gray-400 italic">Sem título</span>}
                                    </p>
                                    
                                  </div>
                                ) : (
                                  <p className="text-gray-400 italic text-sm">Sem título</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  {(!id || (itemToEditLoaded)) && <FileInput _upload={{ key: 'report_link', filename: form.report_link }} res={handleUploadedFiles} label={'Relatório da Campanha'} />}
                </div>
              </div>
            )}
            button={(
              <div className={`mt-[40px]`}>
                <FormLayout.Button onClick={() => {
                  SubmitForm();
                }} valid={valid} loading={loading} label={id ? "Actualizar" : 'Enviar'} />
              </div>
            )}
          >

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              r={true}
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'title_pt'])}
              label={'Titulo (pt)'}
              onChange={(e) => setForm({ ...form, title_pt: e.target.value })}
              field={'title_pt'}
              value={form.title_pt}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              r={true}
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'title_en'])}
              label={'Titulo (en)'}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              field={'title_en'}
              value={form.title_en}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'goal_pt'])}
              label={'Objectivo (pt)'}
              onChange={(e) => setForm({ ...form, goal_pt: e.target.value })}
              field={'goal_pt'}
              value={form.goal_pt}
              textarea={true}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'goal_en'])}
              label={'Objectivo (en)'}
              onChange={(e) => setForm({ ...form, goal_en: e.target.value })}
              field={'goal_en'}
              value={form.goal_en}
              textarea={true}
            />


            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'location'])}
              label={'Destino'}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              field={'location'}
              value={form.location}
              r={true}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'date'])}
              label={'Data'}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              field={'date'}
              type={'date'}
              value={form.date}
              r={true}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'description_pt'])}
              label={'Descrição (pt)'}
              textarea={true}
              onChange={(e) => setForm({ ...form, description_pt: e.target.value })}
              field={'description_pt'}
              value={form.description_pt}
              r={true}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'description_en'])}
              label={'Descrição (en)'}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              field={'description_en'}
              value={form.description_en}
              r={true}
            />


            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              type={'number'}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'goal'])}
              label={'Valor do objectivo'}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              field={'goal'}
              value={form.goal}
            />

            <FormLayout.Input
              verified_inputs={verified_inputs}
              form={form}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'youtube_link'])}
              label={'Link de Video - Youtube'}
              onChange={(e) => setForm({ ...form, youtube_link: e.target.value })}
              field={'youtube_link'}
              value={form.youtube_link}
            />

            <div className="w-full mt-6 mb-3">

              <div className={`${!form.insert_amount_raised_manually ? 'opacity-50 pointer-events-none hidden' : ''}`}>
                <FormLayout.Input
                  verified_inputs={verified_inputs}
                  form={form}
                  type={'number'}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'raised'])}
                  label={'Valor arrecadado'}
                  onChange={(e) => setForm({ ...form, raised: e.target.value })}
                  field={'raised'}
                  r={form.insert_amount_raised_manually}
                  value={form.raised}
                />
              </div>

              <div className="flex justify-start">
                <label className={`flex ${!(loading) ? 'cursor-pointer' : ''} items-center gap-x-1`}>
                  <input onClick={() => {
                    setVerifiedInputs(verified_inputs.filter(i => i != 'raised'))
                    setForm({ ...form, insert_amount_raised_manually: !form.insert_amount_raised_manually, raised: '' })
                  }} checked={form.insert_amount_raised_manually} id="checkbox-table-3" type="checkbox" class={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2`} />
                  <span>Inserir valor arrecadado manualmente</span>
                </label>
              </div>
            </div>
          </FormLayout>
        </div>
      </DefaultAdminLayout>
    </>
  )
}