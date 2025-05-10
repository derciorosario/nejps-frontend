import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/index';
import Campaigns from  './pages/campaigns/index'
import Donations from './pages/donations/index'
import Test from './pages/test';
import NotFound from './pages/404';
import AdminDashboard from './admin/pages/dashboard/index'
import AdminCampaigns from './admin/pages/campaign/index'
import AdminEvents from './admin/pages/events/index'
import CreateAdminCampaign from './admin/pages/campaign/create'
import Login from './admin/pages/login';
import ProtectedRoute from './admin/ProtectedRoute';
import CreateAdminEvents from './admin/pages/events/create';
import CreateGalleryAdmin from './admin/pages/gallery/create'
import Contact from './pages/contact/index'
import CampaignDetails from './pages/campaign-details/index'

import CreateAdminSettings from './admin/pages/settings/create'
import AdminGalleryCategory from './admin/pages/gallery-categories/index'
import CreateAdminGalleryCategory from './admin/pages/gallery-categories/create'
import CreateAdminPaymentMethod from './admin/pages/payment-methods/create'
import AdminPaymentMethod from './admin/pages/payment-methods/index'
import AdminNewsLetter from './admin/pages/newsletter/index'
import CreateAdminNewsLetter from './admin/pages/newsletter/create'
import AdminFeedback from './admin/pages/feedback/index'
import CreateAdminFeedback from './admin/pages/feedback/create'
import AdminContact from './admin/pages/contacts/index'
import CreateAdminContact from './admin/pages/contacts/create'
import AdminDonors from './admin/pages/donors/index'
import CreateAdminDonors from './admin/pages/donors/create'
import Events from './pages/events/index'
import AdminVolunteers from './admin/pages/volunteers/index'
import CreateAdminVolunteers from './admin/pages/volunteers/create'


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/dashboard"  element={<ProtectedRoute redirectTo="/login"><AdminDashboard/></ProtectedRoute>} />
          <Route path="/login"  element={<Login/>} />
          <Route path="/admin/campaigns/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminCampaign/> </ProtectedRoute>} />
          <Route path="/admin/campaign/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminCampaign/> </ProtectedRoute>} />
          <Route path="/admin/campaigns"  element={<ProtectedRoute redirectTo="/login"><AdminCampaigns/></ProtectedRoute>}/>

          <Route path="/admin/settings"  element={<ProtectedRoute redirectTo="/login"><CreateAdminSettings/></ProtectedRoute>}/>
          <Route path="/admin/gallery-categories/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminGalleryCategory/> </ProtectedRoute>} />
          <Route path="/admin/gallery-category/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminGalleryCategory/> </ProtectedRoute>} />
          <Route path="/admin/gallery-categories"  element={<ProtectedRoute redirectTo="/login"><AdminGalleryCategory/></ProtectedRoute>}/>

          <Route path="/admin/payment-methods/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminPaymentMethod/> </ProtectedRoute>} />
          <Route path="/admin/payment-method/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminPaymentMethod/> </ProtectedRoute>} />
          <Route path="/admin/payment-methods"  element={<ProtectedRoute redirectTo="/login"><AdminPaymentMethod/></ProtectedRoute>}/>

          <Route path="/admin/contacts/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminContact/> </ProtectedRoute>} />
          <Route path="/admin/contact/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminContact/> </ProtectedRoute>} />
          <Route path="/admin/contacts"  element={<ProtectedRoute redirectTo="/login"><AdminContact/></ProtectedRoute>}/>

          <Route path="/admin/volunteers/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminVolunteers/> </ProtectedRoute>} />
          <Route path="/admin/volunteer/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminVolunteers/> </ProtectedRoute>} />
          <Route path="/admin/volunteers"  element={<ProtectedRoute redirectTo="/login"><AdminVolunteers/></ProtectedRoute>}/>

          <Route path="/admin/feedback/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminFeedback/> </ProtectedRoute>} />
          <Route path="/admin/feedback/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminFeedback/> </ProtectedRoute>} />
          <Route path="/admin/feedback"  element={<ProtectedRoute redirectTo="/login"><AdminFeedback/></ProtectedRoute>}/>

          <Route path="/admin/newsletter/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminNewsLetter/> </ProtectedRoute>} />
          <Route path="/admin/newsletter/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminNewsLetter/> </ProtectedRoute>} />
          <Route path="/admin/newsletter"  element={<ProtectedRoute redirectTo="/login"><AdminNewsLetter/></ProtectedRoute>}/>

          <Route path="/admin/gallery"  element={<ProtectedRoute redirectTo="/login"> <CreateGalleryAdmin/> </ProtectedRoute>} />
          <Route path="/admin/events/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminEvents/> </ProtectedRoute>} />
          <Route path="/admin/event/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminEvents/> </ProtectedRoute>} />
          <Route path="/admin/events"  element={<ProtectedRoute redirectTo="/login"><AdminEvents/></ProtectedRoute>} />

          <Route path="/admin/donors/create"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminDonors/> </ProtectedRoute>} />
          <Route path="/admin/donor/:id"  element={<ProtectedRoute redirectTo="/login"> <CreateAdminDonors/> </ProtectedRoute>} />
          <Route path="/admin/donors"  element={<ProtectedRoute redirectTo="/login"><AdminDonors/></ProtectedRoute>} />
         
          <Route path="/campaigns"  element={<Campaigns/>} />
          <Route path="/campaign/:id"  element={<CampaignDetails/>} />
          <Route path="/events"  element={<Events/>} />
          <Route path="/donations"  element={<Donations/>} />
          <Route path="/contact"  element={<Contact/>} />
          <Route path="/test"  element={<Test/>} />
          <Route path="*" element={<NotFound />} />

        </Routes>
    </Router>

  );
}


export default App;
