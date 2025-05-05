import React,{useEffect,useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useData } from '../../contexts/DataContext';
import AOS from "aos";
import "aos/dist/aos.css"; 
import TopImage from '../../assets/images/terms.jpg'
import { t } from 'i18next';
import FormLayout from '../../layout/DefaultFormLayout';
import { toast } from 'react-toastify';
import BasicPopUp from '../../components/modals/basic';
import Loader from '../../components/loaders/loader';




function App({}) {

 
  const data=useData()
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  
  useEffect(() => {

    if(!data.bgVideoLoaded) return

    AOS.init({
      duration: 700,
      delay: 200, 
      easing: 'ease-in-out', 
      offset: 50, 
    }); 
}, [data.bgVideoLoaded]);

useEffect(()=>{
    data.setBgVideoLoaded(true)
    data.setBgImageLoaded(true)
    data._scrollToSection('home')
},[])

const [valid,setValid]=useState(false)


useEffect(()=>{

    let v=true

    if (
        !data.form.name ||
        !data.form.email ||
        !data.form.contact ||
        !data.form.province /*
        !data.form.used_telemedicine_before ||
        !data.form.medical_visits_per_year ||
        !data.form.willing_to_pay_online_consultation ||
        !data.form.preferred_payment_method ||
        !data.form.biggest_healthcare_challenge ||
        !data.form.most_important_benefit ||
        !data.form.join_whatsapp_group ||
        !data.form.open_feedback*/
    ) {
        v=false
    }

    setValid(v)

},[data.form])

console.log(data.form)


async function SubmitForm(){
    setLoading(true)
    
    try{
     
        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.form.email.trim()))){
          toast.error(t('messages.invalid-email'))
          setLoading(false)
          return
        }
        await data.makeRequest({method:'post',url:`api/waiting-list`,withToken:false,data:{
          ...data.form
        }, error: ``},0)
        setMessage(t('messages.message-sent'))
        setLoading(false)

        data._scrollToSection('home')
        data.setForm({...data.initial_form}) 

    }catch(e){

        console.log(e)

      if(e.message==500){
        toast.error(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
      }

      setLoading(false)
      
      
    }
  }





useEffect(()=>{
      if(data.initialized){
             localStorage.setItem('form',JSON.stringify(data.form))
      }
},[data.form,data.initialized])



  return (
   
      <>
     <BasicPopUp message={message} setMessage={setMessage}/>
     <DefaultLayout>

<div  className="w-full h-[200px] flex _cancel_consultation bg-gray-400 relative">
              <img src={TopImage} className="w-full h-full object-cover"/>
              <div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-center px-[100px] max-md:px-6">
              <h2 className="text-white text-[31px] max-md:text-[25px]">{t('common.registration-title')}</h2>
             </div>
</div>

<div className="px-7 my-14">
        <h3 className="max-w-[700px] mx-auto text-center text-[30px] font-semibold mb-6 max-md:text-[20px]">{t('common.signup-form')}</h3>    
</div>


<div>


<div class="flex items-center justify-center py-12 px-8 border">

<div class="mx-auto w-full max-w-[550px] bg-white">

<div>
    <FormLayout.Input 
        r={true}
        value={data.form.name}
        onChange={(e)=>{data.setForm({...data.form,name:e.target.value})}}
        label={t('form.full-name')}
        placeholder={t('form.full-name')}
    />
    <FormLayout.Input
        r={true}
        value={data.form.contact}
        onChange={(e)=>{data.setForm({...data.form,contact:e.target.value.replace(/[^0-9]/g, '')})}}
        label={t('form.contact')}
        placeholder={t('form.enter-contact')}
    />
    <FormLayout.Input
        r={true}
        value={data.form.email}
        onChange={(e)=>{data.setForm({...data.form,email:e.target.value})}}
        label={'Email'}
        placeholder={t('form.enter-email')}
        type={'email'}
    />
    <FormLayout.Input
        r={true}
        value={data.form.province}
        onChange={(e)=>{data.setForm({...data.form,province:e.target.value})}}
        label={t('form.province-or-city')}
        placeholder={t('form.province-or-city')}
        select_options={[
            { name: 'Maputo', value: 'maputo' },
            { name: 'Maputo (Província)', value: 'maputo-provincia' },
            { name: 'Gaza', value: 'gaza' },
            { name: 'Inhambane', value: 'inhambane' },
            { name: 'Sofala', value: 'sofala' },
            { name: 'Manica', value: 'manica' },
            { name: 'Tete', value: 'tete' },
            { name: 'Zambézia', value: 'zambezia' },
            { name: 'Nampula', value: 'nampula' },
            { name: 'Niassa', value: 'niassa' },
            { name: 'Cabo Delgado', value: 'cabo-delgado' },
            { name: 'Matola', value: 'matola' },
            { name: 'Xai-Xai', value: 'xai-xai' },
            { name: 'Inhambane (Cidade)', value: 'inhambane-cidade' },
            { name: 'Beira', value: 'beira' },
            { name: 'Chimoio', value: 'chimoio' },
            { name: 'Tete (Cidade)', value: 'tete-cidade' },
            { name: 'Quelimane', value: 'quelimane' },
            { name: 'Nampula (Cidade)', value: 'nampula-cidade' },
            { name: 'Pemba', value: 'pemba' },
            { name: 'Lichinga', value: 'lichinga' },
        ]}
    />


    <div class="mb-5 pt-5">
       
        <label class="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
            {t('form.user-info')}
        </label>
    
         <FormLayout.Options
            label={t('form.used_telemedicine_before')}
            value={data.form.used_telemedicine_before}
            radioname={'used_telemedicine_before'}
            options={[
                {name:t('common.yes'),value:'yes'},
                {name:t('common.no'),value:'no'}
            ]}

            onChange={(value)=>{
                data.setForm({...data.form,used_telemedicine_before:value})
            }}
            
        />
        
        <FormLayout.Options
        label={t('form.medical_visits_per_year')}
        value={data.form.medical_visits_per_year}
        radioname={'medical_visits_per_year'}
        options={[
            {name:t('form.1-3-times'),value:'1_3_times'},
            {name:t('form.4-6-times'),value:'4_6_times'},
            {name:t('form.more-than-6-times'),value:'more_than_6'},
        ]}
        onChange={(value)=>{
            data.setForm({...data.form,medical_visits_per_year:value})
        }}
        
        />

        <FormLayout.Options
        label={t('form.most_frequent_consultation')}
        value={data.form.most_frequent_consultation}
        input_value={data.form.most_frequent_consultation_input}
        radioname={'most_frequent_consultation'}
        options={[
            {name:t('form.general-practitioner'),value:'general_practitioner'},
            {name:t('form.specialist'),value:'specialist',select_options:[
                { name: t('form.allergy_immunology'), value: 'allergy_immunology' },
                { name: t('form.anesthesiology'), value: 'anesthesiology' },
                { name: t('form.cardiology'), value: 'cardiology' },
                { name: t('form.dermatology'), value: 'dermatology' },
                { name: t('form.endocrinology'), value: 'endocrinology' },
                { name: t('form.gastroenterology'), value: 'gastroenterology' },
                { name: t('form.geriatrics'), value: 'geriatrics' },
                { name: t('form.gynecology'), value: 'gynecology' },
                { name: t('form.hematology'), value: 'hematology' },
                { name: t('form.infectious_diseases'), value: 'infectious_diseases' },
                { name: t('form.neurology'), value: 'neurology' },
                { name: t('form.nephrology'), value: 'nephrology' },
                { name: t('form.oncology'), value: 'oncology' },
                { name: t('form.ophthalmology'), value: 'ophthalmology' },
                { name: t('form.orthopedics'), value: 'orthopedics' },
                { name: t('form.otolaryngology'), value: 'otolaryngology' },
                { name: t('form.pathology'), value: 'pathology' },
                { name: t('form.pediatrics'), value: 'pediatrics' },
                { name: t('form.plastic_surgery'), value: 'plastic_surgery' },
                { name: t('form.psychiatry'), value: 'psychiatry' },
                { name: t('form.pulmonology'), value: 'pulmonology' },
                { name: t('form.radiology'), value: 'radiology' },
                { name: t('form.rheumatology'), value: 'rheumatology' },
                { name: t('form.sports_medicine'), value: 'sports_medicine' },
                { name: t('form.urology'), value: 'urology' },
                { name: t('form.vascular_surgery'), value: 'vascular_surgery' },
                { name: t('form.other'), value: 'other' }
            ]  
            },

            {name:t('common.other'),hide_option:true,value:'other',input:''},

        ]}
        onChange={(value,isInputValue)=>{
            if(isInputValue){
                data.setForm({...data.form,most_frequent_consultation_input:value})
                return
            }
            data.setForm({...data.form,most_frequent_consultation:value,most_frequent_consultation_input:null})
        }}
        
        />

        <label class="mb-5 mt-5 block text-base font-semibold text-[#07074D] sm:text-xl">
            {t('form.payments-and-prices')}
        </label>


    <FormLayout.Options
        label={t('form.willing_to_pay_online_consultation')}
        value={data.form.willing_to_pay_online_consultation}
        radioname={'willing_to_pay_online_consultation'}
        options={[
            {name:t('form.less_than_1000'),value:'less_than_1000'},
            {name:t('form.between_1000_1500'),value:'between_1000_1500'},
            {name:t('form.between_1500_2000'),value:'between_1500_2000'},
            {name:t('form.above_2000'),value:'above_2000'},
        ]}
        onChange={(value)=>{
            data.setForm({...data.form,willing_to_pay_online_consultation:value})
        }}
        />

        <FormLayout.Options
        label={t('form.preferred_payment_method')}
        value={data.form.preferred_payment_method}
        radioname={'preferred_payment_method'}
        input_value={data.form.preferred_payment_method_input}
        options={[
            { name: t('form.mpesa'), value: 'mpesa' },
            { name: t('form.bank_card'), value: 'bank_card' },
            { name: t('form.other_payment'), value: 'other'}
        ]}
        onChange={(value, isInputValue) => {
            if (isInputValue) {
            data.setForm({ ...data.form, preferred_payment_method_input: value });
            return;
            }
            data.setForm({ ...data.form, preferred_payment_method: value,preferred_payment_method_input:null });
        }}
        />

        <label class="mb-5 mt-5 block text-base font-semibold text-[#07074D] sm:text-xl">
            {t('form.problems-and-needs')}
        </label>


        <FormLayout.Options
        label={t('form.biggest_healthcare_challenge')}
        value={data.form.biggest_healthcare_challenge}
        input_value={data.form.biggest_healthcare_challenge_input}
        radioname={'biggest_healthcare_challenge'}
        form={data.form}
        input_type={'checkbox'}
        options={[
            { name: t('form.long_queues'), value: 'long_queues' },
            { name: t('form.lack_of_specialists'), value: 'lack_of_specialists' },
            { name: t('form.high_costs'), value: 'high_costs' },
            { name: t('form.other_challenge'), value: 'other' }
        ]}
        onChange={(value, isInputValue) => {
            if (isInputValue) {
                data.setForm({ ...data.form, biggest_healthcare_challenge_input: value });
                return;
            }

            if(data.form.biggest_healthcare_challenge.includes(value)){
                data.setForm({...data.form,biggest_healthcare_challenge:data.form.biggest_healthcare_challenge.filter(i=>i!=value),biggest_healthcare_challenge_input:null})
            }else{
                data.setForm({ ...data.form, biggest_healthcare_challenge:[...data.form.biggest_healthcare_challenge, value ],biggest_healthcare_challenge_input:null});
            }

        }}
        />

        <FormLayout.Options
        label={t('form.most_important_benefit')}
        value={data.form.most_important_benefit}
        radioname={'most_important_benefit'}
        input_type={'checkbox'}
        input_value={data.form.most_important_benefit_input}
        options={[
            { name: t('form.fast_service'), value: 'fast_service' },
            { name: t('form.affordable_consultations'), value: 'affordable_consultations' },
            { name: t('form.specialist_access'), value: 'specialist_access' },
            { name: t('form.other_benefit'), value: 'other' }
        ]}

        onChange={(value, isInputValue) => {
            if (isInputValue) {
            data.setForm({ ...data.form, most_important_benefit_input: value });
            return;
            }

            if(data.form.most_important_benefit.includes(value)){
                data.setForm({...data.form,most_important_benefit:data.form.most_important_benefit.filter(i=>i!=value),most_important_benefit_input:null})
            }else{
                data.setForm({ ...data.form, most_important_benefit:[...data.form.most_important_benefit, value ],most_important_benefit_input:null});
            }

        }}
        />

        <label class="mb-5 mt-5 block text-base font-semibold text-[#07074D] sm:text-xl">
            {t('form.desired-features')}
        </label>

        <FormLayout.Options
        label={t('form.most_useful_feature')}
        value={data.form.most_useful_feature}
        input_value={data.form.most_useful_feature_input}
        radioname={'most_useful_feature'}
        options={[
            { name: t('form.video_call_consultation'), value: 'video_call_consultation' },
            { name: t('form.chat_24_7'), value: 'chat_24_7' },
            { name: t('form.online_prescription'), value: 'online_prescription' },
            { name: t('form.other_whatsapp_group'), value: 'other' }
        ]}
        onChange={(value, isInputValue) => {
            if (isInputValue) {
            data.setForm({ ...data.form, most_useful_feature_input: value });
            return;
            }
            data.setForm({ ...data.form, most_useful_feature: value ,most_useful_feature_input:null });
        }}
        />

    <FormLayout.Options
        label={t('form.join_whatsapp_group')}
        value={data.form.join_whatsapp_group}
        radioname={'join_whatsapp_group'}
        options={[
            {name:t('common.yes'),value:'yes'},
            {name:t('common.no'),value:'no'},
            {name:t('common.maybe'),value:'maybe'}
        ]}
        onChange={(value)=>{
            data.setForm({...data.form,join_whatsapp_group:value})
        }}
      />

        <label class="mb-5 mt-5 block text-base font-semibold text-[#07074D] sm:text-xl">
            {t('form.open-feedback')}
        </label>

        <FormLayout.Input
            label={t('form.open_feedback')}
            value={data.form.open_feedback}
            onChange={(e) => {
                data.setForm({ ...data.form, open_feedback: e.target.value });
            }}
            textarea={true}
        />

    </div>

    <div className="relative">
         {loading && <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                <Loader/>
         </div>}
        <button
            onClick={()=>{
               SubmitForm()
            }}
            class={`${valid ? '':'opacity-40 pointer-events-none'}  ${loading ? 'pointer-events-none':''} hover:shadow-form w-full rounded-md bg-honolulu_blue-400 py-3 px-8 text-center text-base font-semibold text-white outline-none`}>
           <span className={`${loading ? 'opacity-0':''}`}> { t('common.send-info')}</span>
        </button>
    </div>

    <div className="my-3">
        <span onClick={()=>data.setForm(data.initial_form)} className="text-gray-400 hover:text-black text-[14px] underline  cursor-pointer">{t('form.reset-form')}</span>
    </div>
</div>
</div>
</div>



</div>

        </DefaultLayout>
      </>
  );
}

export default App;
