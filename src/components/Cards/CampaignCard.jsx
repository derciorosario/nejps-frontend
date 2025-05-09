import React from "react";
import { CalendarDays, Goal, MapPin, Target } from "lucide-react";
import i18next, { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";

const CampaignCard = ({ campaign, index, setShowDonationDialog, setShowHowToDonateDialog }) => {

  let raised = campaign.donations.map(item => parseFloat(item.amount || 0)).reduce((acc, curr) => acc + curr, 0);
  if (campaign.insert_amount_raised_manually) {
    raised = parseFloat(campaign.raised || 0);
  }

  const progress = Math.min((parseFloat(raised) / parseFloat(campaign.goal)) * 100, 100);
  const data = useData();
  const navigate=useNavigate()

  return (
    <div className="rounded shadow-md overflow-hidden bg-white flex flex-col h-full">
      <div className="relative bg-gray-400">
        <img
          onClick={()=>{
              data.setSelectedCampaign(campaign)
              navigate('/campaign/'+campaign.id)
          }}
          src={data.APP_BASE_URL + "/file/" + campaign.image_filename}
          alt={campaign[`title_` + i18next.language]}
          className={`w-full h-64 object-cover hover:scale-105 transition-all cursor-pointer ease-in ${!campaign.image_filename ? 'opacity-0':''}`}
        />
        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-md">
          {t("common.campaign-" + campaign.status)}
        </div>
      </div>
      <div className="p-6 space-y-4">

        <h3 className="text-[18px] font-semibold">{campaign[`title_` + i18next.language]}</h3>

        <div className="flex items-center text-sm text-gray-600 space-x-4">
        <div className="flex items-center space-x-1">
        <CalendarDays className="h-4 w-4" />
        <span>
        <label>{campaign.date.split("T")[0]?.split("-")?.reverse()?.join("/")}</label>
        </span>
        </div>
        <div className="flex items-center space-x-1 flex-1">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span>{campaign.location}</span>
        </div>
        </div>

        {campaign[`goal_` + i18next.language] && (
        <div className="flex items-center space-x-1 flex-1">
          <Goal className="h-4 w-4 flex-shrink-0 inline mr-1 text-gray-600" />
        <span> {campaign[`goal_` + i18next.language]}</span>
        </div>
        )}

        <p className="text-sm text-gray-700 leading-snug text-justify">
        {campaign[`description_` + i18next.language]}
        </p>

        {campaign.report_link && (
            <div
              onClick={() => {
                window.open(`${data.APP_BASE_URL}/file/${campaign.report_link}`, "_blank");
              }}
              className="bg-rose-100 text-rose-600 cursor-pointer px-1 py-1 rounded items-center inline-flex"
            >
                              <svg className="fill-rose-600 mr-2" height="18px" width="18px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                  viewBox="0 0 370.32 370.32" xml:space="preserve">
                                <g>
                                <path  d="M148.879,85.993H95.135c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.744
                                  c8.284,0,15-6.716,15-15C163.879,92.709,157.163,85.993,148.879,85.993z"/>
                                <path  d="M148.879,148.327H95.135c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.744
                                  c8.284,0,15-6.716,15-15C163.879,155.043,157.163,148.327,148.879,148.327z"/>
                                <path  d="M211.944,253.354v14.608h7.717c9.359,0,9.359-5.599,9.359-7.439c0-1.775,0-7.17-9.359-7.17H211.944z
                                  "/>
                                <path  d="M325.879,225.752h-24.41V73.703c0-3.934-1.56-7.705-4.344-10.484l-58.876-58.88
                                  C235.465,1.561,231.699,0,227.765,0H50.58C34.527,0,21.469,13.059,21.469,29.112v312.095c0,16.054,13.059,29.113,29.111,29.113
                                  h221.777c16.052,0,29.111-13.06,29.111-29.113v-30.048h24.41c12.687,0,22.973-10.285,22.973-22.973v-39.462
                                  C348.852,236.038,338.566,225.752,325.879,225.752z M269.855,337.906H53.082V32.414H207.17V75.99
                                  c0,10.555,8.554,19.107,19.105,19.107h43.58v130.655h-74.178c-12.688,0-22.973,10.286-22.973,22.973v39.462
                                  c0,12.688,10.285,22.973,22.973,22.973h74.178V337.906z M238.51,260.523c0,10.441-7.224,16.928-18.85,16.928h-7.717v8.977
                                  c0,2.316-1.877,4.197-4.195,4.197h-1.097c-2.319,0-4.197-1.881-4.197-4.197v-38.366c0-2.316,1.878-4.197,4.197-4.197h13.009
                                  C231.287,243.864,238.51,250.246,238.51,260.523z M262.305,290.625H247.21c-2.319,0-4.197-1.881-4.197-4.197v-38.366
                                  c0-2.316,1.877-4.197,4.197-4.197h15.095c13.148,0,23.845,10.5,23.845,23.409C286.15,280.15,275.454,290.625,262.305,290.625z
                                  M322.455,249.156c0,2.32-1.878,4.197-4.197,4.197h-17.045v10.053h14.521c2.317,0,4.197,1.875,4.197,4.195v1.099
                                  c0,2.316-1.88,4.197-4.197,4.197h-14.521v13.53c0,2.316-1.877,4.197-4.196,4.197h-1.096c-2.32,0-4.197-1.881-4.197-4.197v-38.366
                                  c0-2.316,1.877-4.197,4.197-4.197h22.337c2.319,0,4.197,1.881,4.197,4.197V249.156z"/>
                                <path  d="M262.305,253.354h-9.803v27.782h9.803c7.915,0,14.355-6.222,14.355-13.862
                                  C276.661,259.598,270.221,253.354,262.305,253.354z"/>
                              </g>
                           </svg>
              <span>{t("common.download-campaign-report")}</span>
            </div>
          )}

</div>
      
      <div className="p-6 space-y-4 flex flex-col h-full">

     
      

        <div className="w-full space-y-4 _bottom_ mt-auto">
          <div>
            <p className="text-sm font-semibold text-rose-600">
              {t("common.raised")} {data._cn(raised)}MZN
            </p>
            {campaign.goal != 0 && (
              <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {campaign.goal != 0 && (
              <div className="flex justify-end text-sm font-medium text-gray-800 mt-1">
                {t("common.goal")} {data._cn(campaign.goal)}MZN
              </div>
            )}
          </div>

          <div className="flex items-center gap-x-2 relative">
            <button
              onClick={() => {
                setShowHowToDonateDialog(true);
              }}
              className="bg-rose-600 border-white border text-white px-6 py-3 rounded shadow hover:bg-rose-700"
            >
              {t("common.donate")}
            </button>
            {campaign.donations.length != 0 && (
              <button
                onClick={() => {
                  setShowDonationDialog(campaign);
                }}
                className="text-rose-600 border border-rose-600 hover:bg-rose-700 hover:text-white bg-white text-sm rounded px-4 py-3"
              >
                {t("common.see-donations")}
              </button>
            )}
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default function CampaignList({
  campaigns = [],
  setShowDonationDialog,
  showDonationDialog,
  setShowHowToDonateDialog,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-[1300px] mx-auto">
        {campaigns.map((campaign, index) => (
          <CampaignCard
            setShowHowToDonateDialog={setShowHowToDonateDialog}
            setShowDonationDialog={setShowDonationDialog}
            showDonationDialog={showDonationDialog}
            key={index}
            index={index}
            campaign={campaign}
          />
        ))}
      </div>
    </div>
  );
}
