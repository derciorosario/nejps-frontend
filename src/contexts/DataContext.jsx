import { createContext, useContext,useState,useEffect} from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
const DataContext = createContext();
import Img1 from '../assets/img/banner/1.jpg'
import Img2 from '../assets/img/banner/2.jpg'
import Img3 from '../assets/img/banner/3.jpg'

export const DataProvider = ({ children }) => {

    const [bgImageLoaded,setBgImageLoaded] = useState(false);
    const [initialized,setInitialized]=useState(false)
    const imageUrls = [Img1,Img2,Img3];
    const [isPreloaderLoaded, setIsPreloaderLoaded] = useState(false);
    const [imagesLoadedItems, setImagesLoadedItems] = useState([])


    const preloadImage = (url, retries = 0) => {

      const retryDelay = 3000
      const maxRetries = 3; 

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = ()=>{
          if(imagesLoadedItems.length < imageUrls.length) setImagesLoadedItems(prev=>([...prev.filter(i=>i!=url),url]))
          resolve()
        };
        img.onerror = () => {
          if (retries < maxRetries) {
            setTimeout(() => {
              preloadImage(url, retries + 1).then(resolve).catch(reject);
            }, retryDelay);
          } else {
            reject();
          }
        };
      });

    };

    useEffect(() => {
      const loadImages = async () => {
        try {
          await Promise.all(imageUrls.map((url) => preloadImage(url)));
        } catch (error) {
          console.log('Failed to load images:', error);
        }
      };
      loadImages()
    }, []);


    useEffect(()=>{
        if(imagesLoadedItems.length >= imageUrls.length){
          setIsPreloaderLoaded(true)
        }
    },[imagesLoadedItems])


    const initial_form = {};

    let initial_popups={
      feedback:false,
      lang:false,
      basic_popup:false,
      join:false,
      filters:false,
      filter:false
    }

    const {makeRequest,APP_BASE_URL,SERVER_FILE_STORAGE_PATH,isLoading,setIsLoading,user,serverTime,setServerTime,APP_FRONDEND} = useAuth()
    
    const [_loaded,setLoaded]=useState([])
    const [_managers,setManagers]=useState([])
    const [_campaigns,setCampaigns]=useState([])
    const [_events,setEvents]=useState([])
    const [_home_campaigns,setHomeCampaigns]=useState([])
    const [_home_events,setHomeEvents]=useState([])
    const [_donations,setDonations]=useState([])
    const [_gallery,setGallery]=useState([])
    const [_gallery_categories,setGalleryCategories]=useState([])
    const [_volunteers,setVolunteers]=useState([])
    const [_home_volunteers,setHomeVolunteers]=useState([])
    const [_feedback,setFeedback]=useState([])
    const [_contacts,setContacts]=useState([])
    const [_payment_methods,setPaymentMethods]=useState([])
    const [_newsletter,setNewsLetter]=useState([])
    const [_donors,setDonors]=useState([])
    const [_donors_list,setDonorsList]=useState([])

    const [_dashboard,setDasboard]=useState([])
    const [updateTable,setUpdateTable]=useState(null)
    
    let dbs=[
      {name: 'donors_list', update: setDonorsList, get: _donors },
      {name: 'volunteers', update: setVolunteers, get: _volunteers },
      {name: 'home_volunteers', update: setHomeVolunteers, get: _home_volunteers },
      {name: 'donors', update: setDonors, get: _donors },
      {name: 'gallery', update: setGallery, get: _gallery },
      {name: 'gallery_categories', update: setGalleryCategories, get: _gallery_categories },
      {name: 'volunteers', update: setVolunteers, get: _volunteers },
      {name: 'feedback', update: setFeedback, get: _feedback },
      {name: 'contacts', update: setContacts, get: _contacts },
      {name: 'payment_methods', update: setPaymentMethods, get: _payment_methods },
      {name: 'newsletter', update: setNewsLetter, get: _newsletter },
      {name:'managers',update:setManagers,get:_managers},
      {name:'dashboard',update:setDasboard,get:_managers},
      {name:'campaigns',update:setCampaigns,get:_campaigns},
      {name:'events',update:setEvents,get:_events},
      {name:'home_campaigns',update:setHomeCampaigns,get:_campaigns},
      {name:'home_events',update:setHomeEvents,get:_events},
      {name:'donations',update:setDonations,get:_donations},
      {name:'gallery',update:setGallery,get:_gallery}
    ]
    
    function handleLoaded(action,item){
      if(Array.isArray(item) && action=="remove"){
        setLoaded((prev)=>prev.filter(i=>!item.includes(i)))
        return
      }
      if(action=='add'){
         setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
      }else{
         setLoaded((prev)=>prev.filter(i=>i!=item))
      }
    }   

    const [form,setForm]=useState(initial_form)

    const [_openPopUps, _setOpenPopUps] = useState(initial_popups);
  
    function _closeAllPopUps(){
          _setOpenPopUps(initial_popups)
          document.removeEventListener('click', handleOutsideClick)
    }
 
    const handleOutsideClick = (event) => {
      let close=true
      Object.keys(initial_popups).forEach(f=>{
          if(event?.target?.closest(`._${f}`))  {
            close=false
          }
      })
      if(close){
        document.removeEventListener('click', handleOutsideClick); 
        _closeAllPopUps()
      }
      
    };
  
    const  _showPopUp = (option,value) => {
        setTimeout(()=>document.addEventListener('click', handleOutsideClick),200)
        _setOpenPopUps({...initial_popups,[option]:value || true})
    }

    const [selectedSidePage,setSelectedSidePage]=useState(null)
    const [showContact,setShowContact]=useState(false)

    useEffect(()=>{
      setTimeout(()=>{
          setIsLoading(false)
      },[1000])
    },[])

    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
    setScrollY(window.scrollY)
    };

    useEffect(() => {
      handleScroll()
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);


    const _scrollToSection = (to,instant) => {
      const Section = document.getElementById(to);
      console.log({Section})
      if (Section) {
        Section.scrollIntoView({ behavior:instant ? 'instant' :  (to=="home" || to=="about" || to=="move_after_pagination" || to=="contact") ? 'smooth':'instant' });
      }else{
        setTimeout(()=>_scrollToSection(to),2000)
      }

   }

   function text_l(text,max=50){
    if(text?.length > max){
       text=text.slice(0,max)+"..."
    }
    return text
   }


   function _cn(number){
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number)
  }

   function _cn_n(string){
        string=string.toString()
        if (string.startsWith('0')) {
          string = string.replace('0', '');
        }
        return string.replace(/[^0-9]/g, '')
   }

   const [_selectedTableItems,setSelectedTableItems]=useState([])

   const [itemsToDelete,setItemsToDelete]=useState({
     items:[],
     url:null,
     deleteFunction:'default'
   })

   function add_remove_table_item(id){
       if(_selectedTableItems.includes(id)){
          setSelectedTableItems(_selectedTableItems.filter(i=>i!=id))
       }else{
          setSelectedTableItems([..._selectedTableItems,id])
       }
   }


   const [downloadProgress,setDownloadProgress] = useState(0) 

   const handleDownload = (filename) => {
     console.log({filename})
     setDownloadProgress(1)
     const xhr = new XMLHttpRequest();
     
     let url=filename.includes('storage/uploads') ? `${APP_BASE_URL}/api/download/${filename.split('/')[filename.split('/').length - 1]}` :  filename.includes('http://') || filename.includes('https://') ? filename : `${APP_BASE_URL}/api/download/${filename}`

     console.log({url})
     xhr.open('GET', url, true);
     
     xhr.responseType = 'blob'; 
     
     // Track download progress
     xhr.onprogress = (event) => {
         if (event.lengthComputable) {
             const percentComplete = (event.loaded / event.total) * 100;
             console.log(`Download Progress: ${percentComplete.toFixed(2)}%`);
             // Update your progress state if needed
             setDownloadProgress(percentComplete.toFixed(2)); // assuming setDownloadProgress is a state setter
         }
     };
 
     // Handle download completion
     xhr.onload = () => {
         if (xhr.status === 200) {
             const blob = xhr.response;
             const downloadUrl = window.URL.createObjectURL(blob);
 
             const link = document.createElement('a');
             link.href = downloadUrl;
             link.download = filename; // Name of the file for download
             document.body.appendChild(link);
             link.click();
 
             // Clean up
             link.remove();
             window.URL.revokeObjectURL(downloadUrl);
             setDownloadProgress(0); // Reset progress
         } else {
             console.error('Download failed:', xhr.statusText);
             toast.error('Erro ao baixar');
             setDownloadProgress(0)
         }
     };
 
     // Handle errors
     xhr.onerror = () => {
         console.error('Error downloading file:', xhr.statusText);
         toast.error('Erro ao baixar');
         setDownloadProgress(0)
         
     };
 
     // Start the request
     xhr.send();
   };


   async function _get(from, params, wait = true) {
    let items = typeof from === "string" ? [from] : from;
    let _data = {};

    if (wait) {
        for (let f = 0; f < items.length; f++) {
            let selected = dbs.find(i => i.name === items[f]);
            try {
                let response = await makeRequest({
                    params: params?.[items[f]],
                    method: 'get',
                    url: `api/${items[f].replaceAll('_', '-')}`,
                    withToken: true,
                    error: ``
                }, 100);
                handleLoaded('add', items[f]);
                selected.update(response);
                _data[items[f]] = response;
            } catch (e) {
                console.log(items[f]);
                console.log({ e });
                _data[items[f]] = [];
            }
        }
    } else {
        let requests = items.map(async (item) => {
            let selected = dbs.find(i => i.name === item);
            try {
                let response = await makeRequest({
                    params: params?.[item],
                    method: 'get',
                    url: `api/${item.replaceAll('_', '-')}`,
                    withToken: true,
                    error: ``
                }, 100);
                handleLoaded('add', item);
                selected.update(response);
                return { item, response };
            } catch (e) {
                console.log(item);
                console.log({ e });
                return { item, response: [] };
            }
        });

        let results = await Promise.all(requests);
        results.forEach(({ item, response }) => {
            _data[item] = response;
        });
    }

    return _data;
   }
  
   useEffect(()=>{
      setSelectedTableItems([])
   },[updateTable])


    let required_data=['home_campaigns','gallery','gallery_categories','home_events','payment_methods','home_volunteers'] //

    useEffect(()=>{ 
      if(initialized) return
      handleLoaded('remove',required_data)
      _get(required_data,{
          gallery:{all:true},
          gallery_categories:{all:true},
          home_campaigns:{h_n:true},
          home_volunteers:{status:"active"},
      },false) 
    },[])

    useEffect(()=>{ 
        if(_loaded.includes('home_campaigns') && _loaded.includes('home_volunteers') && _loaded.includes('payment_methods') && _loaded.includes('gallery_categories') && _loaded.includes('home_events') && _loaded.includes('gallery')){
            setInitialized(true)
        }
    },[_loaded])


    function getParamsFromFilters(options){
      let params={}
      options.forEach(o=>{
         if(params[o.param]){
           if(o.selected_ids.length)  {
             params[o.param]=params[o.param]+","+o.selected_ids.join(',')
           }
         }else{
           params[o.param]=o.selected_ids.join(',')
         }
         
      })

      return params
 }
    

    const value = {
      getParamsFromFilters,
      _donors,
      _donors_list,
      isPreloaderLoaded,
      _campaigns,
      _home_campaigns,
      _home_events,
      _gallery,
      _gallery_categories,
      _home_volunteers,
      _volunteers,
      _feedback,
      _contacts,
      _payment_methods,
      _newsletter,
      _dashboard,
      _events,
      _gallery,
      _donations,
      updateTable,
      setUpdateTable,
      _get,
      handleDownload,
      downloadProgress,setDownloadProgress,
      APP_BASE_URL,
      _selectedTableItems,setSelectedTableItems,
      itemsToDelete,setItemsToDelete,
      add_remove_table_item,
      initial_form,
      initialized,
      handleLoaded,
      _loaded,
      _cn,
      text_l,
      setInitialized,
      form,
      setForm,
      _scrollToSection,
      showContact,
      setShowContact,
      selectedSidePage,
      setSelectedSidePage,
      _showPopUp,
      _closeAllPopUps,
      _openPopUps,
      handleOutsideClick,
      _setOpenPopUps,
      makeRequest,
      bgImageLoaded,
      setBgImageLoaded,
      isLoading,
      setIsLoading,
      scrollY
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
   return useContext(DataContext);
};