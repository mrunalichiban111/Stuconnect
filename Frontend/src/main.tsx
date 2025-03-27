import ReactDOM from 'react-dom/client'
import '@/main.css'
import { ThemeProvider } from "@/components/theme/theme-provider"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/Layout'
import { SignIn } from '@/pages/auth/signin-page'
import { SignUp } from '@/pages/auth/signup-page'
import MainLayout from '@/pages/MainLayout'
import { store, persistor } from '@/app/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Test from '@/pages/Test'
import ServerIdPage from '@/pages/ServerIdPage'
import ChannelIdPage from '@/pages/ChannelIdPage'
import MemberIdPage from '@/pages/MemberIdPage'
import VideoRoom from '@/components/chat/VideoRoom'
import AudioRoom from '@/components/chat/AudioRoom'
import LayoutOpenAI from '@/pages/OpenAI/LayoutOpenAI'
import FilePage from '@/pages/OpenAI/FilePage'
import ChatGPT from '@/pages/OpenAI/ChatGPT'

const router = createBrowserRouter([
  // Protected Routes are Layout and its childrens
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: "servers/:id/",
            element: <ServerIdPage />,
            children: [
              {
                path: "channels/:channelId",
                element: <ChannelIdPage />
              },
              {
                path: "members/:memberId",
                element: <MemberIdPage />
              },
            ]
          },
        ]
      },
      {
        path: "openai/",
        element: <LayoutOpenAI />,
        children: [
          {
            path: "file",
            element: <FilePage />,
          },
          {
            path: "chatgpt/:fileName",
            element: <ChatGPT />,
          }
        ]
      },
      {
        path: "video/:videoId",
        element: <VideoRoom />
      },
      {
        path: "audio/:audioId",
        element: <AudioRoom />
      },
    ]
  },
  //Public Routes
  {
    path: "/sign-in",
    element: <SignIn />
  },
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/test",
    element: <Test />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <ToastContainer newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </ThemeProvider>
    </PersistGate>
  </Provider>
)
